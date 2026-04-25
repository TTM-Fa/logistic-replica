import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Icon({ id, className }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`/images/sprite.svg#${id}`} />
    </svg>
  );
}

function NavGroup({ icon, label, children, defaultOpen }) {
  const location = useLocation();
  const isGroupActive = children.some(child => location.pathname.startsWith(child.to));
  const [open, setOpen] = useState(defaultOpen || isGroupActive);

  return (
    <div className={styles.navItem}>
      <button
        className={`${styles.navGroupHeader} ${isGroupActive ? styles.groupActive : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <Icon id={icon} className={styles.navIcon} />
        <span className={styles.navLabel}>{label}</span>
        <Icon
          id="small-arrow-right"
          className={`${styles.chevron} ${open ? styles.open : ''}`}
        />
      </button>
      <div className={`${styles.submenu} ${open ? styles.open : ''}`}>
        {children.map(child => (
          <NavLink
            key={child.to}
            to={child.to}
            className={({ isActive }) =>
              `${styles.subLink} ${isActive ? styles.active : ''}`
            }
          >
            {child.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Logo */}
      <div className={styles.logo}>
        <Icon id="market-insights" className={styles.logoIcon} />
        {!collapsed && <span className={styles.logoText}>Market Insights</span>}
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navSection}>
          {/* Freight Perspectives */}
          <NavLink
            to="/road/freight-perspectives"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <Icon id="market-analytics" className={styles.navIcon} />
            {!collapsed && <span className={styles.navLabel}>Freight Perspectives</span>}
          </NavLink>

          {/* Market Overview */}
          <NavGroup
            icon="chart-line-new"
            label="Market Overview"
            children={[
              { to: '/road/market/overview', label: 'Overview' },
              { to: '/road/market/demand', label: 'Demand' },
            ]}
          />

          {/* Lanes */}
          <NavGroup
            icon="lane-insights"
            label="Lanes"
            defaultOpen
            children={[
              { to: '/road/lanes/lane-overview/standard', label: 'Lane Overview' },
              { to: '/road/lanes/lane-comparison/standard', label: 'Lane Comparison' },
              { to: '/road/lanes/yearly-comparison/standard', label: 'Yearly Comparison' },
              { to: '/road/lanes/top-movers/standard', label: 'Top Movers' },
            ]}
          />

          {/* Rates */}
          <NavGroup
            icon="spot-contract"
            label="Rates"
            children={[
              { to: '/road/rates/overview', label: 'Overview' },
              { to: '/road/rates/forecast', label: 'Forecast' },
              { to: '/road/rates/spot-vs-contract', label: 'Spot vs Contract' },
            ]}
          />

          {/* Capacity */}
          <NavLink
            to="/road/capacity"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <Icon id="capacity" className={styles.navIcon} />
            {!collapsed && <span className={styles.navLabel}>Capacity</span>}
          </NavLink>

          {/* Costs */}
          <NavGroup
            icon="cost-insights"
            label="Costs"
            children={[
              { to: '/road/costs/diesel-price', label: 'Diesel Price' },
              { to: '/road/costs/lane', label: 'Lane' },
              { to: '/road/costs/market', label: 'Market' },
            ]}
          />

          {/* Rate on Demand */}
          <NavGroup
            icon="calculator"
            label="Rate on Demand"
            children={[
              { to: '/road/rate-on-demand/spot', label: 'Spot' },
              { to: '/road/rate-on-demand/contract', label: 'Contract' },
            ]}
          />

          {/* Dashboard */}
          <NavLink
            to="/road/dashboards"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <Icon id="dashboard" className={styles.navIcon} />
            {!collapsed && <span className={styles.navLabel}>Dashboard</span>}
          </NavLink>
        </div>

        <div className={styles.divider} />

        {/* Autonomous Quotation */}
        <div className={styles.navSection}>
          <NavGroup
            icon="autonomous-quotation"
            label="Autonomous Quotation"
            children={[
              { to: '/autonomous-quotation/live', label: 'Live' },
              { to: '/autonomous-quotation/rules', label: 'Rules' },
              { to: '/autonomous-quotation/configuration', label: 'Configuration' },
            ]}
          />
        </div>

        <div className={styles.divider} />

        {/* Utilities */}
        <div className={styles.navSection}>
          <NavLink
            to="/road/subscriptions"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <Icon id="subscription" className={styles.navIcon} />
            {!collapsed && <span className={styles.navLabel}>Subscriptions</span>}
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <Icon id="cog" className={styles.navIcon} />
            {!collapsed && <span className={styles.navLabel}>Settings</span>}
          </NavLink>

          <NavGroup
            icon="help"
            label="Help"
            children={[
              { to: '/road/help', label: 'Knowledge Center' },
              { to: '/road/help/coverage-overview', label: 'Coverage Overview' },
              { to: '/road/help/api', label: 'API' },
              { to: '/road/help/releases', label: 'Releases' },
            ]}
          />

          <NavLink
            to="/road/help/contact-support"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <Icon id="support" className={styles.navIcon} />
            {!collapsed && <span className={styles.navLabel}>Contact support</span>}
          </NavLink>
        </div>
      </nav>

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomActions}>
          <button className={styles.iconBtn} title="Log out">
            <Icon id="logout" />
          </button>
          <div className={styles.spacer} />
          <button className={styles.iconBtn} title="Collapse navigation" onClick={onToggle}>
            <Icon id={collapsed ? 'small-arrow-forward' : 'small-arrow-back'} />
          </button>
        </div>
      </div>
    </aside>
  );
}
