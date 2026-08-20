export function PhoneOrientationGuard() {
  return (
    <aside className="phone-orientation" aria-live="polite">
      <span className="phone-orientation__icon" aria-hidden="true">↻</span>
      <strong>Поверни телефон<br />боком</strong>
      <p>Так карта не растянется,<br />а предметы и проходы останутся<br />на своих местах.</p>
    </aside>
  );
}
