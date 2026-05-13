import { useReducer, useCallback, useEffect } from 'react';

/**
 * State machine for the document generation journey.
 *
 * Steps:
 *   'browse'   — landing (hero + trending + categories + my docs)
 *   'category' — drill into a single category
 *   'detail'   — template detail modal open over browse/category
 *   'mode'     — choose AI Assistant vs Custom Form
 *   'collect'  — collecting variables (chat or form)
 *   'preview'  — full preview + download CTA
 *   'success'  — confetti + download confirmation
 */

const STORAGE_KEY = 'mb_doc_generation_drafts';

const initialState = {
  step: 'browse',
  selectedCategoryId: null,
  selectedTemplate: null,
  mode: null,
  values: {},
  pdf: null, // { blob, dataUri, filename }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'OPEN_CATEGORY':
      return { ...state, step: 'category', selectedCategoryId: action.categoryId };
    case 'EXIT_CATEGORY':
      return { ...state, step: 'browse', selectedCategoryId: null };
    case 'OPEN_TEMPLATE':
      return { ...state, step: 'detail', selectedTemplate: action.template };
    case 'CLOSE_TEMPLATE':
      return { ...state, step: state.selectedCategoryId ? 'category' : 'browse', selectedTemplate: null };
    case 'START_GENERATION':
      return { ...state, step: 'mode', mode: null, values: action.values || {} };
    case 'SET_MODE':
      return { ...state, step: 'collect', mode: action.mode };
    case 'UPDATE_VALUES':
      return { ...state, values: { ...state.values, ...action.values } };
    case 'REPLACE_VALUES':
      return { ...state, values: action.values || {} };
    case 'GO_PREVIEW':
      return { ...state, step: 'preview' };
    case 'GO_BACK_TO_COLLECT':
      return { ...state, step: 'collect' };
    case 'BACK_TO_MODE':
      return { ...state, step: 'mode' };
    case 'SET_PDF':
      return { ...state, step: 'success', pdf: action.pdf };
    case 'RESET_TO_BROWSE':
      return { ...initialState };
    case 'EXIT_GENERATION':
      return {
        ...state,
        step: state.selectedCategoryId ? 'category' : 'browse',
        selectedTemplate: null,
        mode: null,
        values: {},
        pdf: null,
      };
    default:
      return state;
  }
};

const loadDraft = (templateId) => {
  if (!templateId || typeof window === 'undefined') return null;
  try {
    const all = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    return all[templateId] || null;
  } catch {
    return null;
  }
};

const saveDraft = (templateId, values) => {
  if (!templateId || typeof window === 'undefined') return;
  try {
    const all = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    all[templateId] = { values, updatedAt: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // ignore quota errors
  }
};

const clearDraft = (templateId) => {
  if (!templateId || typeof window === 'undefined') return;
  try {
    const all = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    delete all[templateId];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
};

export const useGenerationFlow = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Autosave values to localStorage while collecting.
  useEffect(() => {
    if (state.selectedTemplate && state.step === 'collect') {
      saveDraft(state.selectedTemplate.id, state.values);
    }
  }, [state.values, state.selectedTemplate, state.step]);

  const openCategory = useCallback(
    (categoryId) => dispatch({ type: 'OPEN_CATEGORY', categoryId }),
    []
  );
  const exitCategory = useCallback(() => dispatch({ type: 'EXIT_CATEGORY' }), []);
  const openTemplate = useCallback((template) => dispatch({ type: 'OPEN_TEMPLATE', template }), []);
  const closeTemplate = useCallback(() => dispatch({ type: 'CLOSE_TEMPLATE' }), []);

  const startGeneration = useCallback(
    (template, opts = {}) => {
      const draft = opts.resumeDraft ? loadDraft(template.id) : null;
      dispatch({ type: 'OPEN_TEMPLATE', template });
      dispatch({ type: 'START_GENERATION', values: draft ? draft.values : {} });
    },
    []
  );

  const setMode = useCallback((mode) => dispatch({ type: 'SET_MODE', mode }), []);
  const backToMode = useCallback(() => dispatch({ type: 'BACK_TO_MODE' }), []);

  const updateValues = useCallback(
    (values) => dispatch({ type: 'UPDATE_VALUES', values }),
    []
  );
  const replaceValues = useCallback(
    (values) => dispatch({ type: 'REPLACE_VALUES', values }),
    []
  );

  const goPreview = useCallback(() => dispatch({ type: 'GO_PREVIEW' }), []);
  const goBackToCollect = useCallback(() => dispatch({ type: 'GO_BACK_TO_COLLECT' }), []);
  const setPdf = useCallback((pdf) => dispatch({ type: 'SET_PDF', pdf }), []);

  const exitGeneration = useCallback(() => {
    if (state.selectedTemplate) clearDraft(state.selectedTemplate.id);
    dispatch({ type: 'EXIT_GENERATION' });
  }, [state.selectedTemplate]);

  const resetAll = useCallback(() => dispatch({ type: 'RESET_TO_BROWSE' }), []);

  return {
    state,
    actions: {
      openCategory,
      exitCategory,
      openTemplate,
      closeTemplate,
      startGeneration,
      setMode,
      backToMode,
      updateValues,
      replaceValues,
      goPreview,
      goBackToCollect,
      setPdf,
      exitGeneration,
      resetAll,
    },
    storage: { loadDraft, saveDraft, clearDraft },
  };
};

export default useGenerationFlow;
