export const Icon = ({ children, className = 'h-5 w-5', ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...rest}
  >
    {children}
  </svg>
)

export const HomeIcon = (p) => (
  <Icon {...p}>
    <path d="M4 11l8-7 8 7" />
    <path d="M6 10v10h12V10" />
    <path d="M10 20v-5h4v5" />
  </Icon>
)
export const TemplateIcon = (p) => (
  <Icon {...p}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M4 9h16M10 9v12" />
  </Icon>
)
export const FolderIcon = (p) => (
  <Icon {...p}>
    <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </Icon>
)
export const SettingsIcon = (p) => (
  <Icon {...p}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="8" cy="17" r="2" />
  </Icon>
)
export const LogoutIcon = (p) => (
  <Icon {...p}>
    <path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9" />
  </Icon>
)
export const MenuIcon = (p) => (
  <Icon {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Icon>
)
export const PlusIcon = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)
export const ArrowRightIcon = (p) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
)
export const FileIcon = (p) => (
  <Icon {...p}>
    <path d="M7 3h7l5 5v13H7z" />
    <path d="M14 3v5h5" />
  </Icon>
)
export const BellIcon = (p) => (
  <Icon {...p}>
    <path d="M6 9a6 6 0 0112 0c0 5 2 6.5 2 6.5H4S6 14 6 9z" />
    <path d="M10 19a2 2 0 004 0" />
  </Icon>
)
export const UserIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
  </Icon>
)
export const HelpIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.6-1.5 1.1-1.5 2.2" />
    <path d="M12 17h.01" />
  </Icon>
)
export const ChevronDownIcon = (p) => (
  <Icon {...p}>
    <path d="M6 9l6 6 6-6" />
  </Icon>
)
export const LetterIcon = (p) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </Icon>
)
export const ActivityIcon = (p) => (
  <Icon {...p}>
    <path d="M3 12h4l3-8 4 16 3-8h4" />
  </Icon>
)
export const ShieldCheckIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z" />
    <path d="M8.5 12l2.5 2.5 4.5-5" />
  </Icon>
)
export const BriefcaseIcon = (p) => (
  <Icon {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" />
  </Icon>
)
export const ChatIcon = (p) => (
  <Icon {...p}>
    <path d="M4 5h16v11H9l-5 4z" />
    <path d="M8 9.5h8M8 12.5h5" />
  </Icon>
)
export const SparkIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    <path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
  </Icon>
)
export const CheckIcon = (p) => (
  <Icon {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
)