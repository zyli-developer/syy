import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Spin, Button } from 'antd';
import useProposalSquareStyles, { cardColors } from '../styles/components/proposal/ProposalSquare';
import { ChallengeCard } from '../components/card/ChallengeCard';

const mockProposals = [
  {
    id: 1,
    title: 'Flow',
    desc: "A new AI filmmaking tool that lets you seamlessly create cinematic clips, scenes and stories with consistency using Google's most capable generative models.",
    img: '/static/flow.png',
    btn: 'Create with Flow',
    colorIdx: 0,
  },
  {
    id: 2,
    title: 'Project Mariner',
    desc: 'Project Mariner is a research prototype exploring the future of human-agent interaction, starting with browsers.',
    img: '/static/mariner.png',
    btn: 'Try It Now',
    colorIdx: 1,
  },
  {
    id: 3,
    title: 'SynthID Detector',
    desc: 'Upload an image, audio file, or video to detect if it has been created by Google AI.',
    img: '/static/synthid.png',
    btn: 'Learn More',
    colorIdx: 2,
  },
  {
    id: 4,
    title: 'Stitch',
    desc: 'Turn simple prompts or images into intricate desktop/mobile UI designs and frontend code, then refine via AI-chat and export to Figma.',
    img: '/static/stitch.png',
    btn: 'Try It Now',
    colorIdx: 3,
  },
];

const ProposalSquarePage = () => {
  const { styles } = useProposalSquareStyles();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();

  // 滚动加载逻辑
  const lastProposalRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
          setLoading(true);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // 模拟加载数据
  useEffect(() => {
    if (!loading) return;
    setTimeout(() => {
      const newProposals = mockProposals.map((item, idx) => ({
        ...item,
        id: (page - 1) * 10 + idx + 1,
        colorIdx: (idx + (page - 1) * 10) % cardColors.length,
      }));
      setProposals((prev) => (page === 1 ? newProposals : [...prev, ...newProposals]));
      setHasMore(page < 3);
      setLoading(false);
    }, 800);
  }, [page, loading]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.cardGrid}>
        {proposals.map((item, idx) => (
           <ChallengeCard
           key={item.id}
           {...item}
                   />
        ))}
      </div>
      {loading && <div style={{ textAlign: 'center', padding: 32 }}><Spin /></div>}
      {!hasMore && <div style={{ textAlign: 'center', color: '#aaa', padding: 16 }}>没有更多了</div>}
    </div>
  );
};

export default ProposalSquarePage; 