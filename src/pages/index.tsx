import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

function Hero() {
  return (
    <div className="hero-signal">
      <h1 className="hero-title">
        Find the <span className="accent">Signal</span>
      </h1>
      <p className="hero-subtitle">
        Master the art of interviewing. A structured, hands-on workshop for
        interviewers and candidates — built on proven methodology.
      </p>
      <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
        <Link to="/docs/workshop-101/" className="signal-btn signal-btn-primary">
          Start Workshop 101
        </Link>
        <Link to="/docs/workshop-201/" className="signal-btn signal-btn-secondary">
          Browse All Workshops
        </Link>
      </div>
    </div>
  );
}

function WorkshopCards() {
  const workshops = [
    {
      id: '101',
      title: 'Foundations & STAR',
      description:
        'Why interviews fail, the Bar Raiser philosophy, and a deep dive into the STAR method with hands-on practice.',
      sections: 9,
      time: '~120 min',
      level: 'Guided',
      colorClass: 'workshop-101',
      link: '/docs/workshop-101/',
    },
    {
      id: '201',
      title: 'Principles & Skills',
      description:
        'Leadership principles as interview lenses, writing great questions, active listening, and running a debrief.',
      sections: 8,
      time: '~120 min',
      level: 'Supported',
      colorClass: 'workshop-201',
      link: '/docs/workshop-201/',
    },
    {
      id: '301',
      title: 'Advanced',
      description:
        'Full interview loops, cross-company frameworks, difficult scenarios, and a capstone mock interview.',
      sections: 6,
      time: '~90 min',
      level: 'Independent',
      colorClass: 'workshop-301',
      link: '/docs/workshop-301/',
    },
  ];

  return (
    <div className="workshop-grid">
      {workshops.map((w) => (
        <Link key={w.id} to={w.link} className={`workshop-card ${w.colorClass}`}>
          <span className="workshop-badge">{w.id}</span>
          <h3>{w.title}</h3>
          <p>{w.description}</p>
          <div className="meta">
            <span>{w.sections} sections</span>
            <span>{w.time}</span>
            <span>{w.level}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function Home(): React.ReactElement {
  return (
    <Layout
      title="Signal — Interview Workshop"
      description="Master the art of interviewing with structured, hands-on workshops."
    >
      <Hero />
      <main>
        <WorkshopCards />
      </main>
    </Layout>
  );
}
