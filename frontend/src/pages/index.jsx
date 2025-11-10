import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {  motion,useAnimation } from "framer-motion"; // ✅ fixed import

export default function Index() {
  const navigate = useNavigate();
  const controls = useAnimation();
  const heroRef = useRef(null);

  // Typewriter effect
useEffect(() => {
  const text = "Discover. Rate. Improve.";
  let i = 0;
  const speed = 100;
  const element = document.getElementById("typewriter");
  if (!element) return;

  let typing; // store timeout ID

  const type = () => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      typing = setTimeout(type, speed);
    }
  };

  element.innerHTML = "";
  type();

  // ✅ cleanup prevents double typing in React Strict Mode
  return () => clearTimeout(typing);
}, []);


  const handleGetStarted = () => navigate("/login");

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) controls.start("visible");
        });
      },
      { threshold: 0.3 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [controls]);

  return (
    <div style={styles.page}>
      {/* ====== Animated Gradient Background ====== */}
      <div style={styles.gradientBg}>
        <div style={styles.blob1}></div>
        <div style={styles.blob2}></div>
        <div style={styles.blob3}></div>
      </div>

      {/* ===== Navbar ===== */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>⭐ StoreRate</div>
        <div style={styles.navLinks}>
          <a href="#about" style={styles.link}>About</a>
          <a href="#features" style={styles.link}>Features</a>
          <a href="#contact" style={styles.link}>Contact</a>
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <section style={styles.hero} ref={heroRef}>
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={styles.title}
        >
          Welcome to <span style={{ color: "#4CAF50" }}>StoreRate</span>
        </motion.h1>

        <motion.p
          id="typewriter"
          style={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        ></motion.p>

        <motion.button
          onClick={handleGetStarted}
          whileHover={{ scale: 1.08, boxShadow: "0 0 25px #4CAF50" }}
          whileTap={{ scale: 0.95 }}
          style={styles.btn}
        >
          🚀 Get Started
        </motion.button>
      </section>

      {/* ===== About Section ===== */}
      <motion.section
        id="about"
        variants={fadeUp}
        initial="hidden"
        animate={controls}
        style={styles.section}
      >
        <h2 style={styles.sectionTitle}>About the Project</h2>
        <p style={styles.text}>
          <strong>StoreRate</strong> lets users explore and rate stores around them.
          Store owners manage their profiles and see insights from ratings and feedback.
          Admins can oversee all users and stores, ensuring trust and transparency.
        </p>
      </motion.section>

      {/* ===== Features Section ===== */}
      <motion.section
        id="features"
        variants={fadeUp}
        initial="hidden"
        animate={controls}
        style={styles.section}
      >
        <h2 style={styles.sectionTitle}>Key Features</h2>
        <div style={styles.featuresGrid}>
          {[
            "⭐ User Ratings & Reviews",
            "🏬 Store Management Dashboard",
            "👤 Role-Based Access",
            "📊 Real-Time Analytics",
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              style={styles.featureCard}
            >
              {feature}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ===== Contact Section ===== */}
      <motion.section
        id="contact"
        variants={fadeUp}
        initial="hidden"
        animate={controls}
        style={styles.section}
      >
        <h2 style={styles.sectionTitle}>Contact Us</h2>
        <p style={styles.text}>
          Have questions or feedback? Reach out at{" "}
          <a href="mailto:support@storerate.com" style={styles.emailLink}>
            support@storerate.com
          </a>
        </p>
      </motion.section>

      {/* ===== Footer ===== */}
      <footer style={styles.footer}>
        © {new Date().getFullYear()} StoreRate 
      </footer>
    </div>
  );
}

/* ===== Motion Variants ===== */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

/* ===== Styles ===== */
const styles = {
  page: {
    backgroundColor: "#0e0e0e",
    color: "white",
    fontFamily: "Poppins, sans-serif",
    minHeight: "100vh",
    position: "relative",
    overflowX: "hidden",
  },
  gradientBg: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    overflow: "hidden",
  },
  blob1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, #4CAF50 0%, transparent 70%)",
    top: "-100px",
    left: "-150px",
    borderRadius: "50%",
    animation: "float 10s ease-in-out infinite",
  },
  blob2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, #2196F3 0%, transparent 70%)",
    bottom: "-120px",
    right: "-150px",
    borderRadius: "50%",
    animation: "float 12s ease-in-out infinite",
  },
  blob3: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, #FFC107 0%, transparent 70%)",
    top: "30%",
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: "50%",
    opacity: 0.3,
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 60px",
    backgroundColor: "rgba(20,20,20,0.8)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  logo: {
    fontSize: "1.7rem",
    fontWeight: "bold",
    color: "#4CAF50",
  },
  navLinks: {
    display: "flex",
    gap: "25px",
  },
  link: {
    color: "#ddd",
    textDecoration: "none",
    fontSize: "1rem",
    transition: "color 0.3s",
  },
  hero: {
    textAlign: "center",
    padding: "140px 30px 100px",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: "1.4rem",
    color: "#aaa",
    marginTop: "15px",
    minHeight: "30px",
  },
 btn: {
  marginTop: "40px",
  padding: "10px 20px",                 // smaller padding
  width: "150px",                       // ✅ fixed smaller width
  background: "linear-gradient(90deg, #4CAF50, #45a049)",
  border: "none",
  borderRadius: "8px",
  color: "white",
  fontSize: "1rem",
  cursor: "pointer",
  boxShadow: "0 0 15px rgba(76, 175, 80, 0.4)",
  transition: "all 0.3s ease",
  display: "inline-block",
},

  section: {
    padding: "90px 60px",
    backgroundColor: "rgba(30,30,30,0.9)",
    margin: "30px 0",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "2rem",
    color: "#4CAF50",
    marginBottom: "20px",
  },
  text: {
    color: "#ccc",
    fontSize: "1.1rem",
    maxWidth: "800px",
    margin: "0 auto",
    lineHeight: "1.6",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "25px",
    marginTop: "40px",
  },
  featureCard: {
    backgroundColor: "#222",
    padding: "25px",
    borderRadius: "12px",
    fontWeight: "500",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  },
  emailLink: {
    color: "#4CAF50",
    textDecoration: "none",
  },
  footer: {
    textAlign: "center",
    padding: "25px",
    backgroundColor: "#181818",
    fontSize: "0.9rem",
    color: "#aaa",
  },
};

// Floating animation
const styleTag = document.createElement("style");
styleTag.innerHTML = `
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(20px); }
  100% { transform: translateY(0px); }
}`;
document.head.appendChild(styleTag);
