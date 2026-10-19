using Vanguard.Application.DTOs.Settings;

namespace Vanguard.Application.Interfaces;

public interface ISettingsService
{
    Task<EngineSettingsDto> GetSettingsAsync(CancellationToken cancellationToken = default);
    Task<EngineSettingsDto> UpdateSettingsAsync(EngineSettingsDto settings, CancellationToken cancellationToken = default);
    Task<ActionResultDto> ExecuteDangerZoneActionAsync(string actionName, string justification, CancellationToken cancellationToken = default);
}
