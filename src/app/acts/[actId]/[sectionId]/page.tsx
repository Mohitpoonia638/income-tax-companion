import type { Metadata } from 'next';
import { SectionPageClient } from './SectionPageClient';

interface PageProps {
  params: Promise<{
    actId: string;
    sectionId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { actId, sectionId } = await params;
  const secNum = sectionId.toUpperCase();
  return {
    title: `Section ${secNum} — Income Tax Act ${actId}`,
    description: `Section ${secNum} of Income Tax Act ${actId} — AI-powered legal intelligence, simple explanation, practical examples, 1961 vs 2025 comparison, case laws, and revision notes.`,
  };
}

export default async function SectionResultPage({ params }: PageProps) {
  const { actId, sectionId } = await params;
  return (
    <SectionPageClient
      actId={actId}
      sectionId={sectionId}
    />
  );
}
