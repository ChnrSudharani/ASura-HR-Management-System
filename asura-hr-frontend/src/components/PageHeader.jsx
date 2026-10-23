
import './PageHeader.css'

function PageHeader({
                        title,
                        subtitle,
                        email = '',
                    }) {
    const displayName = email
        ? email.split('@')[0]
        : 'User'

    const initials = displayName
        .split(/[._\s-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('')

    return (
        <header className="page-header">
            <div className="page-header-heading">
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>

            <div className="page-header-user">
                <div className="page-header-user-details">
          <span className="page-header-user-name">
            {displayName}
          </span>
                    <span className="page-header-user-role">
            HR User
          </span>
                </div>

                <div
                    className="page-header-user-avatar"
                    aria-label={`User ${displayName}`}
                    title={email || displayName}
                >
                    {initials || 'U'}
                </div>
            </div>
        </header>
    )
}

export default PageHeader
