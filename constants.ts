
import { Project } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Rusty Neural Network',
    author: 'BinaryGhost',
    category: 'Code',
    description: 'A custom MLP implementation in Rust that I stopped working on when I discovered PyTorch.',
    content: 'fn main() { // TODO: Implement backpropagation without crying... }',
    abandonedDate: '2023-11-12',
    reasonForAbandonment: 'Linear algebra is hard.',
    adoptions: 12,
    tags: ['Rust', 'AI', 'Math'],
    status: 'buried',
    epitaph: 'Strangled by ownership rules and the cold silence of a missing optimizer.',
    aiAutopsy: 'The patient suffered from severe dependency bloat and lack of matrix multiplication optimization.'
  },
  {
    id: '2',
    title: 'The Silent Clocktower',
    author: 'NovelWorm',
    category: 'Literature',
    description: 'A Gothic horror novel about a clock that counts down to people\'s forgotten memories.',
    content: 'The gears groaned like an old man waking from a dream he never wanted to have...',
    abandonedDate: '2022-05-30',
    reasonForAbandonment: 'Writer\'s block at Chapter 4.',
    adoptions: 45,
    tags: ['Horror', 'Gothic', 'Novel'],
    status: 'resurrected',
    epitaph: 'Time stopped when the ink ran dry and the memories became too heavy to carry.',
    aiAutopsy: 'Atmospheric pacing was strong, but the protagonist lacked clear motivation beyond being spooked.'
  },
  {
    id: '3',
    title: 'Cyber-Viking UI Kit',
    author: 'PixelRaider',
    category: 'Design',
    description: 'A Figma design kit merging Nordic runes with futuristic neon aesthetics.',
    content: '[Link to nowhere]',
    abandonedDate: '2024-01-05',
    reasonForAbandonment: 'Client pivoted to "Minimalist Beige".',
    adoptions: 8,
    tags: ['UI/UX', 'Figma', 'Cyberpunk'],
    status: 'buried',
    epitaph: 'Slain by a minimalist beige sword in the halls of corporate boredom.'
  }
];

export const CATEGORIES = ['Code', 'Literature', 'Design', 'Hardware', 'Music'];
