import React, {useState} from 'react';
import {useProgressStore} from '../stores/progressStore';
import {SECTIONS, getSectionsForWorkshop, getWorkshopMaxXP, getTotalMaxXP} from '../data/sections';
import {BADGES} from '../data/badges';

interface ModuleProgressProps {
  view: 'summary' | 'full';
  workshopId?: '101' | '201' | '301';
}

function StatusIcon({status}: {status: string}) {
  if (status === 'complete') {
    return <span style={{color: '#22c55e', fontSize: '1.1rem'}}>&#10003;</span>;
  }
  if (status === 'in-progress') {
    return <span style={{color: 'var(--signal-teal)', fontSize: '1.1rem'}}>&#9679;</span>;
  }
  return <span style={{color: 'var(--signal-silver)', fontSize: '1.1rem'}}>&#9675;</span>;
}

function ProgressBar({value, max}: {value: number; max: number}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div
      style={{
        height: '8px',
        background: 'var(--signal-silver)',
        borderRadius: '4px',
        overflow: 'hidden',
        flex: 1,
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background:
            pct === 100
              ? 'linear-gradient(90deg, var(--signal-teal), #22c55e)'
              : 'var(--signal-teal)',
          borderRadius: '4px',
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
}

function WorkshopAccordion({workshop, label}: {workshop: '101' | '201' | '301'; label: string}) {
  const [open, setOpen] = useState(false);
  const sections = getSectionsForWorkshop(workshop);
  const sectionState = useProgressStore((s) => s.sections);
  const workshopXP = sections.reduce((sum, sec) => sum + (sectionState[sec.id]?.xpEarned || 0), 0);
  const maxXP = getWorkshopMaxXP(workshop);
  const completed = sections.filter((sec) => sectionState[sec.id]?.status === 'complete').length;

  return (
    <div className="signal-card" style={{marginBottom: '1rem', padding: 0, overflow: 'hidden'}}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.25rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--ifm-heading-font-family)',
          fontWeight: 600,
          fontSize: '1rem',
          color: 'var(--ifm-font-color-base)',
        }}
      >
        <span>{label}</span>
        <span style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <span style={{fontSize: '0.85rem', color: 'var(--signal-slate)'}}>
            {completed}/{sections.length} sections &middot; {workshopXP}/{maxXP} XP
          </span>
          <span style={{transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none'}}>
            &#9660;
          </span>
        </span>
      </button>
      {open && (
        <div style={{padding: '0 1.25rem 1rem'}}>
          {sections.map((sec) => {
            const sp = sectionState[sec.id];
            return (
              <div
                key={sec.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 0',
                  borderTop: '1px solid var(--signal-silver)',
                }}
              >
                <StatusIcon status={sp?.status || 'available'} />
                <span style={{flex: 1, fontSize: '0.9rem'}}>{sec.title}</span>
                <span style={{fontSize: '0.8rem', color: 'var(--signal-slate)', whiteSpace: 'nowrap'}}>
                  {sp?.xpEarned || 0}/{sec.maxXP} XP
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BadgeGallery() {
  const earnedBadges = useProgressStore((s) => s.badges);

  return (
    <div style={{marginTop: '2rem'}}>
      <h3 style={{fontFamily: 'var(--ifm-heading-font-family)'}}>
        Badges ({earnedBadges.length}/{BADGES.length})
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '1rem',
        }}
      >
        {BADGES.map((badge) => {
          const earned = earnedBadges.includes(badge.id);
          return (
            <div
              key={badge.id}
              style={{
                textAlign: 'center',
                padding: '1rem 0.5rem',
                borderRadius: 'var(--signal-radius-md)',
                border: `2px solid ${earned ? 'var(--signal-teal)' : 'var(--signal-silver)'}`,
                background: earned ? 'rgba(43, 207, 206, 0.06)' : 'transparent',
                opacity: earned ? 1 : 0.45,
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{fontSize: '2rem', marginBottom: '0.35rem', filter: earned ? 'none' : 'grayscale(100%)'}}>
                {badge.emoji}
              </div>
              <div
                style={{
                  fontFamily: 'var(--ifm-heading-font-family)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
              >
                {badge.name}
              </div>
              <div style={{fontSize: '0.7rem', color: 'var(--signal-slate)', marginTop: '0.2rem'}}>
                {badge.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ModuleProgress({view, workshopId}: ModuleProgressProps) {
  const totalXP = useProgressStore((s) => s.totalXP);
  const streakDays = useProgressStore((s) => s.streakDays);
  const badges = useProgressStore((s) => s.badges);
  const maxXP = getTotalMaxXP();

  if (view === 'summary') {
    const displayXP = workshopId
      ? getSectionsForWorkshop(workshopId).reduce(
          (sum, sec) => sum + (useProgressStore.getState().sections[sec.id]?.xpEarned || 0),
          0,
        )
      : totalXP;
    const displayMax = workshopId ? getWorkshopMaxXP(workshopId) : maxXP;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--signal-radius-md)',
          background: 'rgba(43, 207, 206, 0.06)',
          border: '1px solid rgba(43, 207, 206, 0.15)',
          fontSize: '0.85rem',
          flexWrap: 'wrap',
        }}
      >
        <span>
          <strong style={{color: 'var(--signal-teal)'}}>{displayXP}</strong>/{displayMax} XP
        </span>
        <ProgressBar value={displayXP} max={displayMax} />
        {!workshopId && (
          <>
            <span>{streakDays} day streak</span>
            <span>{badges.length} badges</span>
          </>
        )}
      </div>
    );
  }

  // Full view
  return (
    <div>
      {/* Stats header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {[
          {label: 'Total XP', value: `${totalXP}/${maxXP}`, color: 'var(--signal-teal)'},
          {label: 'Streak', value: `${streakDays} days`, color: 'var(--signal-ember)'},
          {label: 'Badges', value: `${badges.length}/${BADGES.length}`, color: 'var(--signal-slate)'},
        ].map((stat) => (
          <div
            key={stat.label}
            className="signal-card"
            style={{textAlign: 'center', padding: '1.25rem'}}
          >
            <div
              style={{
                fontFamily: 'var(--ifm-heading-font-family)',
                fontSize: '1.8rem',
                fontWeight: 700,
                color: stat.color,
              }}
            >
              {stat.value}
            </div>
            <div style={{fontSize: '0.85rem', color: 'var(--signal-slate)'}}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div style={{marginBottom: '2rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <ProgressBar value={totalXP} max={maxXP} />
          <span style={{fontSize: '0.85rem', color: 'var(--signal-slate)', whiteSpace: 'nowrap'}}>
            {Math.round((totalXP / maxXP) * 100)}%
          </span>
        </div>
      </div>

      {/* Workshop accordions */}
      <WorkshopAccordion workshop="101" label="101 — Foundations & STAR" />
      <WorkshopAccordion workshop="201" label="201 — Principles & Skills" />
      <WorkshopAccordion workshop="301" label="301 — Advanced" />

      {/* Badge gallery */}
      <BadgeGallery />
    </div>
  );
}
