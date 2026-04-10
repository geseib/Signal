import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  workshop101: [
    {
      type: 'doc',
      id: 'workshop-101/index',
      label: 'Overview',
    },
    {
      type: 'category',
      label: 'Modules',
      collapsible: false,
      items: [
        'workshop-101/getting-more-from-interviews',
        'workshop-101/bar-raiser-philosophy',
        'workshop-101/behavioral-vs-technical',
        'workshop-101/star-overview',
        'workshop-101/star-situation',
        'workshop-101/star-task',
        'workshop-101/star-action',
        'workshop-101/star-result',
        'workshop-101/star-practice-lab',
        'workshop-101/first-mock-answer',
      ],
    },
  ],
  workshop201: [
    {
      type: 'doc',
      id: 'workshop-201/index',
      label: 'Overview',
    },
    {
      type: 'category',
      label: 'Modules',
      collapsible: false,
      items: [
        'workshop-201/leadership-principles-overview',
        'workshop-201/mapping-stories-to-principles',
        'workshop-201/probing-and-follow-ups',
        'workshop-201/writing-great-questions',
        'workshop-201/active-listening-and-note-taking',
        'workshop-201/avoiding-bias',
        'workshop-201/the-debrief',
        'workshop-201/capstone-practice-debrief',
      ],
    },
  ],
  workshop301: [
    {
      type: 'doc',
      id: 'workshop-301/index',
      label: 'Overview',
    },
    {
      type: 'category',
      label: 'Modules',
      collapsible: false,
      items: [
        'workshop-301/the-full-interview-loop',
        'workshop-301/frameworks-beyond-amazon',
        'workshop-301/technical-interview-integration',
        'workshop-301/difficult-scenarios',
        'workshop-301/building-a-story-bank',
        'workshop-301/capstone-full-mock-interview',
      ],
    },
  ],
  resources: [
    {
      type: 'doc',
      id: 'question-bank',
      label: 'Question Bank',
    },
  ],
};

export default sidebars;
