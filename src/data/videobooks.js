export const videobooks = [
  {
    id: 'mystery-bottle',
    title: 'The Mystery Bottle',
    category: 'basic-concept-explainers',
    subcategory: 'etkina-college-physics',
    youtubeId: 'RD7bxHtLxX0',
  },
];

export const categories = [
  {
    id: 'research-explainers',
    label: 'Research Explainers',
    subcategories: [],
  },
  {
    id: 'basic-concept-explainers',
    label: 'Basic Concept Explainers',
    subcategories: [
      { id: 'feynman-lectures', label: 'Feynman Lectures' },
      { id: 'etkina-college-physics', label: 'Etkina College Physics' },
      { id: 'tomkins-in-wonderland', label: 'Tomkins in Wonderland' },
    ],
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    subcategories: [
      { id: 'einstein-at-hogwarts', label: 'Einstein at Hogwarts' },
      { id: 'feynman-in-the-shire', label: 'Feynman in the Shire' },
    ],
  },
];
