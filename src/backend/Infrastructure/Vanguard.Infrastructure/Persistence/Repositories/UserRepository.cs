using Microsoft.EntityFrameworkCore;
using Vanguard.Application.Interfaces.Persistence;
using Vanguard.Domain.Entities.Identity;

namespace Vanguard.Infrastructure.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly VanguardDbContext _context;

    public UserRepository(VanguardDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .IgnoreQueryFilters() // Nécessaire lors du login initial pour retrouver le tenant de l'utilisateur
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower() && !u.IsDeleted, cancellationToken);
    }

    public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    public async Task AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _context.Users.AddAsync(user, cancellationToken);
    }

    public async Task<bool> ExistsAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .IgnoreQueryFilters()
            .AnyAsync(u => u.Email.ToLower() == email.ToLower() && !u.IsDeleted, cancellationToken);
    }
}
