import React from 'react';
import HeroSection from './Sections/HeroSection';
import AdvisorSection from './Sections/AdvisorSection';
import BlueprintSection from './Sections/BlueprintSection';
import ProductGridSection from './Sections/ProductGridSection';
import ComparisonSection from './Sections/ComparisonSection';
import ArticleGridSection from './Sections/ArticleGridSection';
import WhyChooseUsSection from './Sections/WhyChooseUsSection';
import FaqSection from './Sections/FaqSection';
import InquirySection from './Sections/InquirySection';
import RichTextSection from './Sections/RichTextSection';

const SECTIONS = {
  // AVer Specialized Enterprise Sections
  hero: HeroSection,
  slider: HeroSection,
  advisor: AdvisorSection,
  blueprint: BlueprintSection,
  products: ProductGridSection,
  comparison: ComparisonSection,
  articles: ArticleGridSection,
  news: ArticleGridSection,
  why_choose_us: WhyChooseUsSection,
  faq: FaqSection,
  inquiry: InquirySection,
  contact: InquirySection,
  rich_text: RichTextSection,
  about: RichTextSection,
  about_content: RichTextSection,
  services: ProductGridSection,
};

export default function SectionRenderer({ sectionKey, props = {} }) {
  const Component = SECTIONS[sectionKey];

  if (!Component) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Section type "${sectionKey}" not registered in SectionRenderer.`);
    }
    return (
      <div className="mx-auto max-w-page p-6 my-4 border border-dashed border-border-clean rounded-xl bg-surface-alt text-center">
        <p className="font-mono text-xs text-muted-slate">
          Section Key: <span className="font-bold text-aver-red">{sectionKey}</span>
        </p>
      </div>
    );
  }

  return <Component {...props} />;
}
