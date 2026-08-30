import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-rich-black py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center">
        <Logo className="[&_span]:text-pure-white" />
        <p className="text-text5 text-pure-white/60">
          © {new Date().getFullYear()} MOAVO Habits
        </p>
      </div>
    </footer>
  );
}
