import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';

import useGenerationFlow from './hooks/useGenerationFlow';
import HeroBanner from './components/HeroBanner';
import TrendingSection from './components/TrendingSection';
import CategoryGrid from './components/CategoryGrid';
import CategoryView from './components/CategoryView';
import AllTemplatesView from './components/AllTemplatesView';
import TemplateDetailModal from './components/TemplateDetailModal';
import GenerationShell from './components/GenerationShell';
import DownloadSuccessModal from './components/DownloadSuccessModal';
import MyDocumentsView, { saveGeneratedDocument } from './components/MyDocumentsView';
import { TEMPLATES } from './data/templates';
import { downloadBlob } from './utils/pdfGenerator';

/**
 * Legal Documents Generation module — premium, mobile-first.
 *
 * Replaces the legacy "Document Review" page. Same route (/legal-documents-review),
 * same default export name expected by App.js.
 */
const DocumentReview = () => {
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  const { state, actions } = useGenerationFlow();
  const [search, setSearch] = useState('');
  const [docsRefresh, setDocsRefresh] = useState(0);
  const allTemplatesRef = useRef(null);
  const myDocsRef = useRef(null);

  // Lock body scroll while the GenerationShell is active.
  useEffect(() => {
    const inJourney = state.step === 'mode' || state.step === 'collect' || state.step === 'preview';
    if (inJourney) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previous;
      };
    }
    return undefined;
  }, [state.step]);

  // Scroll helpers
  const scrollToTemplates = useCallback(() => {
    if (allTemplatesRef.current && typeof window !== 'undefined') {
      const top = allTemplatesRef.current.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);
  const scrollToMyDocs = useCallback(() => {
    if (myDocsRef.current && typeof window !== 'undefined') {
      const top = myDocsRef.current.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  // ---- Handlers ----
  const handleTemplateOpen = (template) => actions.openTemplate(template);
  const handleStartGeneration = (template) => actions.startGeneration(template);

  const handlePdfGenerated = useCallback(
    (pdf) => {
      // Persist to local "My Documents" with the data URI (so it can be re-downloaded).
      try {
        saveGeneratedDocument({
          templateId: state.selectedTemplate?.id,
          templateName: state.selectedTemplate?.name,
          filename: pdf.filename,
          dataUri: pdf.dataUri,
        });
      } catch (e) {
        // localStorage quota errors are silently swallowed; download still works.
        console.warn('Could not save document to local library', e);
      }
      actions.setPdf(pdf);
      setDocsRefresh((n) => n + 1);
    },
    [actions, state.selectedTemplate]
  );

  const handleDownload = useCallback(() => {
    if (state.pdf?.blob) {
      downloadBlob(state.pdf.blob, state.pdf.filename);
    }
  }, [state.pdf]);

  const handleSuccessClose = useCallback(() => {
    actions.exitGeneration();
  }, [actions]);

  const handleGenerateAnother = useCallback(() => {
    actions.exitGeneration();
    setTimeout(scrollToTemplates, 80);
  }, [actions, scrollToTemplates]);

  const handleGoToMyDocs = useCallback(() => {
    actions.exitGeneration();
    setTimeout(scrollToMyDocs, 80);
  }, [actions, scrollToMyDocs]);

  // ---- Render ----
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-[#F8FAFC]'}`}
    >
      <div className="pt-[64px] sm:pt-[72px]">
        {state.step === 'category' ? (
          <CategoryView
            categoryId={state.selectedCategoryId}
            onBack={actions.exitCategory}
            onSelectTemplate={handleTemplateOpen}
            isDarkMode={isDarkMode}
          />
        ) : (
          <>
            <HeroBanner
              search={search}
              setSearch={setSearch}
              totalTemplates={TEMPLATES.length}
              onJumpToTemplates={scrollToTemplates}
              onJumpToMyDocs={scrollToMyDocs}
              isDarkMode={isDarkMode}
            />
            <TrendingSection onSelect={handleTemplateOpen} isDarkMode={isDarkMode} />
            <CategoryGrid onSelectCategory={actions.openCategory} isDarkMode={isDarkMode} />
            <AllTemplatesView
              search={search}
              setSearch={setSearch}
              onSelectTemplate={handleTemplateOpen}
              isDarkMode={isDarkMode}
              idRef={allTemplatesRef}
            />
            <div ref={myDocsRef}>
              <MyDocumentsView onBrowse={scrollToTemplates} isDarkMode={isDarkMode} refreshKey={docsRefresh} />
            </div>
          </>
        )}
      </div>

      {/* Template detail bottom-sheet / modal */}
      <TemplateDetailModal
        open={state.step === 'detail'}
        template={state.selectedTemplate}
        onClose={actions.closeTemplate}
        onStart={handleStartGeneration}
        isDarkMode={isDarkMode}
      />

      {/* Generation journey */}
      {(state.step === 'mode' || state.step === 'collect' || state.step === 'preview') && state.selectedTemplate ? (
        <GenerationShell
          template={state.selectedTemplate}
          step={state.step}
          mode={state.mode}
          values={state.values}
          onUpdateValues={actions.updateValues}
          onReplaceValues={actions.replaceValues}
          onSetMode={actions.setMode}
          onBackToMode={actions.backToMode}
          onGoPreview={actions.goPreview}
          onGoBackToCollect={actions.goBackToCollect}
          onPdfGenerated={handlePdfGenerated}
          onExit={actions.exitGeneration}
          isDarkMode={isDarkMode}
        />
      ) : null}

      {/* Success / download modal */}
      <DownloadSuccessModal
        open={state.step === 'success'}
        template={state.selectedTemplate}
        pdf={state.pdf}
        onClose={handleSuccessClose}
        onDownload={handleDownload}
        onMyDocuments={handleGoToMyDocs}
        onGenerateAnother={handleGenerateAnother}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default DocumentReview;
