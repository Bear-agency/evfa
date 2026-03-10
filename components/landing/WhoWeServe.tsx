 "use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Users2, FlaskConical, Rocket, Home } from "lucide-react";

const items = [
  { icon: GraduationCap, label: "Студенты" },
  { icon: Briefcase, label: "IT-специалисты" },
  { icon: Users2, label: "Квалифицированные сотрудники" },
  { icon: FlaskConical, label: "Научные сотрудники" },
  { icon: Rocket, label: "Предприниматели" },
  { icon: Home, label: "Воссоединение семьи" },
];

export function WhoWeServe() {
  return (
    <motion.section
      className="border-b border-[color:var(--border)] bg-white py-14"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="mb-6 font-serif text-2xl font-semibold text-[color:var(--foreground)] sm:text-3xl">
            Финансовая инфраструктура для заявителей на визу
          </h2>
          <p className="mb-8 max-w-2xl text-sm text-[color:var(--muted)]">
            EVFA помогает разным категориям заявителей подтвердить финансовую
            состоятельность по стандартам европейских консульств — с учётом
            ограничений по переводам и санкционным рискам.
          </p>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, label }, index) => (
            <motion.div
              key={label}
              className="flex items-center gap-3 rounded-lg border border-[color:var(--border)] bg-[rgba(255,255,255,0.9)] p-4 shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: 0.05 * index,
              }}
              whileHover={{ y: -2, scale: 1.01 }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(27,58,107,0.08)]">
                <Icon className="h-4 w-4 text-[color:var(--primary)]" />
              </div>
              <span className="text-sm font-medium text-[color:var(--foreground)]">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

