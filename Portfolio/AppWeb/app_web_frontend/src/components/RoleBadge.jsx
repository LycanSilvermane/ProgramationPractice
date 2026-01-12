import { ROLE_COLORS } from "../constants/roles";

function RoleBadge({ role }) {
  if (!role) return null;

  const color = ROLE_COLORS[role] || "secondary";

  return <span className={`badge bg-${color}`}>{role}</span>;
}

export default RoleBadge;
