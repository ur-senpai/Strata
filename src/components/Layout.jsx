import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useOutlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { useScrollRestoration } from '../hooks/useScrollRestoration.js';

const variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2, ease: 'easeIn' } },
};

// Captures the currently matched route element and animates the swap.
// Sidebar lives outside this tree entirely, so it is never touched by
// route changes — React Router only re-renders what useOutlet() returns.
function AnimatedOutlet() {
  const location = useLocation();
  const element = useOutlet();

  useScrollRestoration(location.pathname);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="page-scroll"
      >
        {element}
      </motion.div>
    </AnimatePresence>
  );
}

export default function Layout() {
  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <AnimatedOutlet />
      </main>
    </div>
  );
}
