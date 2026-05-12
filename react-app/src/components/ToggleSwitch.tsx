interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function ToggleSwitch({ checked, onChange, label }: Props) {
  return (
    <div className="toggle-row" onClick={() => onChange(!checked)}>
      {label && <span className="toggle-label">{label}</span>}
      <div className={`toggle-switch${checked ? ' on' : ''}`}>
        <div className="toggle-knob" />
      </div>
    </div>
  );
}