function Footer() {
  return (
    <footer className="mx-auto mt-10 flex max-w-5xl justify-between border-t-2 border-slate-200 pt-8 text-xs sm:mt-14 sm:pt-10 sm:text-base xl:mt-20">
      <p>© 2026 Trung VQ.</p>
      <p className="text-right">
        Built with <span className="text-sky-600">React</span>, <span className="text-emerald-600">Express</span> &{" "}
        <span className="text-cyan-600">Tailwind</span>.
      </p>
    </footer>
  );
}

export default Footer;
