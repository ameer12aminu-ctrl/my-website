import { useState } from "react";

const AboutPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative min-h-screen overflow-hidden px-6 pb-20 pt-28 md:px-10 lg:pt-32">
      <div className="mx-auto max-w-3xl">
        <p className="reactive-highlight text-xs font-semibold uppercase tracking-[0.48em] text-accent">
          Get in touch
        </p>
        <h1 className="mt-6 font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.9] text-foreground">
          Let's begin.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-foreground/60">
          Anything trained can be retrained. If you have a question, a thought, or just want to connect — this is the place.
        </p>

        {submitted ? (
          <div className="freeform-surface mt-16 rounded-[2.4rem] px-8 py-12 text-center">
            <p className="font-display text-3xl font-bold text-foreground">Message sent.</p>
            <p className="mt-4 text-base leading-8 text-foreground/60">
              Thank you for reaching out. You'll hear back soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-16 space-y-6">
            <div>
              <label htmlFor="name" className="block text-xs uppercase tracking-[0.35em] text-primary">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-3 w-full border-b-2 border-border/40 bg-transparent pb-3 text-lg text-foreground outline-none transition-colors placeholder:text-foreground/25 focus:border-primary"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-[0.35em] text-primary">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-3 w-full border-b-2 border-border/40 bg-transparent pb-3 text-lg text-foreground outline-none transition-colors placeholder:text-foreground/25 focus:border-primary"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs uppercase tracking-[0.35em] text-primary">
                Message
              </label>
              <textarea
                id="message"
                required
                maxLength={1000}
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-3 w-full resize-none border-b-2 border-border/40 bg-transparent pb-3 text-lg leading-8 text-foreground outline-none transition-colors placeholder:text-foreground/25 focus:border-primary"
                placeholder="What's on your mind?"
              />
            </div>

            <button
              type="submit"
              className="reactive-highlight mt-4 inline-flex items-center rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-primary-foreground shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default AboutPage;
