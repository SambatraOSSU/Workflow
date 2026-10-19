using System.Text.Json;
using Vanguard.Application.DTOs.Workflows;
using Vanguard.Application.Interfaces;

namespace Vanguard.Application.Services;

public class GraphValidator : IGraphValidator
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public GraphValidationResultDto ValidateGraph(string graphDefinitionJson)
    {
        if (string.IsNullOrWhiteSpace(graphDefinitionJson))
        {
            return new GraphValidationResultDto(
                IsValid: false,
                Errors: new List<string> { "La définition JSON du graphe est vide." },
                Warnings: new List<string>(),
                NodeCount: 0,
                BranchCount: 0,
                CycleCount: 0,
                TopologySummary: "0 Nodes • 0 Branches • 0 Cycles"
            );
        }

        try
        {
            var graph = JsonSerializer.Deserialize<WorkflowGraphDto>(graphDefinitionJson, JsonOptions);
            if (graph == null)
            {
                return new GraphValidationResultDto(
                    IsValid: false,
                    Errors: new List<string> { "Impossible d'analyser la structure du graphe JSON." },
                    Warnings: new List<string>(),
                    NodeCount: 0,
                    BranchCount: 0,
                    CycleCount: 0,
                    TopologySummary: "0 Nodes • 0 Branches • 0 Cycles"
                );
            }

            return ValidateGraph(graph);
        }
        catch (JsonException ex)
        {
            return new GraphValidationResultDto(
                IsValid: false,
                Errors: new List<string> { $"Syntaxe JSON invalide: {ex.Message}" },
                Warnings: new List<string>(),
                NodeCount: 0,
                BranchCount: 0,
                CycleCount: 0,
                TopologySummary: "0 Nodes • 0 Branches • 0 Cycles"
            );
        }
    }

    public GraphValidationResultDto ValidateGraph(WorkflowGraphDto graph)
    {
        var errors = new List<string>();
        var warnings = new List<string>();

        var nodes = graph.Nodes ?? new List<WorkflowNodeDto>();
        var edges = graph.Edges ?? new List<WorkflowEdgeDto>();

        var nodeCount = nodes.Count;
        if (nodeCount == 0)
        {
            errors.Add("Le graphe ne contient aucun nœud.");
            return new GraphValidationResultDto(false, errors, warnings, 0, 0, 0, "0 Nodes • 0 Branches • 0 Cycles");
        }

        // 1. Unicité des ID des nœuds
        var nodeIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var node in nodes)
        {
            if (string.IsNullOrWhiteSpace(node.Id))
            {
                errors.Add("Un nœud possède un identifiant vide.");
                continue;
            }

            if (!nodeIds.Add(node.Id))
            {
                errors.Add($"Identifiant de nœud en double détecté: '{node.Id}'.");
            }
        }

        // 2. Vérification Trigger & End
        var triggerNodes = nodes.Where(n => string.Equals(n.Type, "trigger", StringComparison.OrdinalIgnoreCase)).ToList();
        var endNodes = nodes.Where(n => string.Equals(n.Type, "end", StringComparison.OrdinalIgnoreCase)).ToList();

        if (triggerNodes.Count == 0)
        {
            errors.Add("Le workflow doit comporter au moins un nœud déclencheur (Trigger).");
        }

        if (endNodes.Count == 0)
        {
            warnings.Add("Le workflow ne comporte aucun nœud de fin explicite (Output / End).");
        }

        // 3. Validation des arêtes
        var inDegree = nodeIds.ToDictionary(id => id, _ => 0, StringComparer.OrdinalIgnoreCase);
        var outDegree = nodeIds.ToDictionary(id => id, _ => 0, StringComparer.OrdinalIgnoreCase);
        var adjacency = nodeIds.ToDictionary(id => id, _ => new List<string>(), StringComparer.OrdinalIgnoreCase);

        foreach (var edge in edges)
        {
            if (string.IsNullOrWhiteSpace(edge.From) || !nodeIds.Contains(edge.From))
            {
                errors.Add($"L'arête '{edge.Id}' référence une source inconnue: '{edge.From}'.");
                continue;
            }

            if (string.IsNullOrWhiteSpace(edge.To) || !nodeIds.Contains(edge.To))
            {
                errors.Add($"L'arête '{edge.Id}' référence une destination inconnue: '{edge.To}'.");
                continue;
            }

            inDegree[edge.To]++;
            outDegree[edge.From]++;
            adjacency[edge.From].Add(edge.To);
        }

        // 4. Nombre de branches (> 1 sortie sur un même nœud)
        var branchCount = outDegree.Count(kv => kv.Value > 1);

        // 5. Nœuds orphelins (sauf triggers)
        foreach (var node in nodes)
        {
            var isTrigger = string.Equals(node.Type, "trigger", StringComparison.OrdinalIgnoreCase);
            var isEnd = string.Equals(node.Type, "end", StringComparison.OrdinalIgnoreCase);

            if (!isTrigger && inDegree.TryGetValue(node.Id, out var incoming) && incoming == 0)
            {
                warnings.Add($"Nœud orphelin détecté: '{node.Label}' ({node.Id}) n'a aucune connexion entrante.");
            }

            if (!isEnd && outDegree.TryGetValue(node.Id, out var outgoing) && outgoing == 0 && !isTrigger)
            {
                warnings.Add($"Nœud terminal sans issue: '{node.Label}' ({node.Id}) n'a aucune connexion sortante.");
            }

            // Vérifications spécifiques de config
            if (string.Equals(node.Type, "gate", StringComparison.OrdinalIgnoreCase))
            {
                if (string.IsNullOrWhiteSpace(node.Config?.ConditionExpression))
                {
                    warnings.Add($"La passerelle conditionnelle '{node.Label}' n'a pas d'expression configurée.");
                }
            }
        }

        // 6. Détection de cycles (DFS Cycle Detection)
        var cycleCount = CountCycles(nodes.Select(n => n.Id).ToList(), adjacency);
        if (cycleCount > 0)
        {
            warnings.Add($"Boucle / Cycle détecté dans le graphe ({cycleCount} cycle(s)). Assurez-vous d'avoir une condition de sortie.");
        }

        var topologySummary = $"{nodeCount} Nodes • {branchCount} Branches • {cycleCount} Cycles";
        var isValid = errors.Count == 0;

        return new GraphValidationResultDto(
            IsValid: isValid,
            Errors: errors,
            Warnings: warnings,
            NodeCount: nodeCount,
            BranchCount: branchCount,
            CycleCount: cycleCount,
            TopologySummary: topologySummary
        );
    }

    private static int CountCycles(List<string> allNodeIds, Dictionary<string, List<string>> adjacency)
    {
        var visited = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase); // 0 = unvisited, 1 = visiting, 2 = visited
        foreach (var id in allNodeIds)
        {
            visited[id] = 0;
        }

        var cycleCount = 0;

        void Dfs(string u)
        {
            visited[u] = 1;
            if (adjacency.TryGetValue(u, out var neighbors))
            {
                foreach (var v in neighbors)
                {
                    if (!visited.ContainsKey(v)) continue;

                    if (visited[v] == 1)
                    {
                        cycleCount++;
                    }
                    else if (visited[v] == 0)
                    {
                        Dfs(v);
                    }
                }
            }
            visited[u] = 2;
        }

        foreach (var id in allNodeIds)
        {
            if (visited[id] == 0)
            {
                Dfs(id);
            }
        }

        return cycleCount;
    }
}
