// ─── Legal Data Loader ─────────────────────────────────────────────────────────

import actsRaw from '@/data/acts.json';
import sectionsRaw from '@/data/sections.json';
import caseLawsRaw from '@/data/case-laws.json';
import amendmentsRaw from '@/data/amendments.json';
import circularsRaw from '@/data/circulars.json';
import notificationsRaw from '@/data/notifications.json';
import rulesRaw from '@/data/rules.json';
import formsRaw from '@/data/forms.json';
import faqsRaw from '@/data/faqs.json';
import studyNotesRaw from '@/data/study-notes.json';

// Demo Datasets (Loaded automatically if primary JSON datasets are empty)
import act1961Demo from '@/data/knowledge/demo/act1961_demo.json';
import act2025Demo from '@/data/knowledge/demo/act2025_demo.json';
import sectionMappingDemo from '@/data/knowledge/demo/section_mapping_demo.json';
import caseLawsDemo from '@/data/knowledge/demo/case_laws_demo.json';
import amendmentsDemo from '@/data/knowledge/demo/amendments_demo.json';
import studyNotesDemo from '@/data/knowledge/demo/study_notes_demo.json';

import {
  parseActsJson,
  parseSectionsJson,
  parseCaseLawsJson,
  parseAmendmentsJson,
  parseCircularsJson,
  parseNotificationsJson,
  parseRulesJson,
  parseFormsJson,
  parseFaqsJson,
  parseStudyNotesJson,
} from './parser';

import { actRepository } from '@/repositories/ActRepository';
import { sectionRepository } from '@/repositories/SectionRepository';
import { caseLawRepository } from '@/repositories/CaseLawRepository';
import { amendmentRepository } from '@/repositories/AmendmentRepository';
import { circularRepository } from '@/repositories/CircularRepository';
import { notificationRepository } from '@/repositories/NotificationRepository';
import { ruleRepository } from '@/repositories/RuleRepository';
import { formRepository } from '@/repositories/FormRepository';
import { faqRepository } from '@/repositories/FaqRepository';
import { studyNoteRepository } from '@/repositories/StudyNoteRepository';

import { searchIndexService } from '@/services/SearchIndexService';

export interface DataLoaderStatus {
  loaded: boolean;
  isDemoDataset: boolean;
  actsCount: number;
  sectionsCount: number;
  caseLawsCount: number;
  amendmentsCount: number;
  circularsCount: number;
  notificationsCount: number;
  rulesCount: number;
  formsCount: number;
  faqsCount: number;
  studyNotesCount: number;
}

class LegalDataLoader {
  private status: DataLoaderStatus = {
    loaded: false,
    isDemoDataset: false,
    actsCount: 0,
    sectionsCount: 0,
    caseLawsCount: 0,
    amendmentsCount: 0,
    circularsCount: 0,
    notificationsCount: 0,
    rulesCount: 0,
    formsCount: 0,
    faqsCount: 0,
    studyNotesCount: 0,
  };

  /**
   * Load all JSON datasets into repositories.
   * If primary JSON datasets are empty, automatically falls back to demo dataset.
   */
  async loadAll(): Promise<DataLoaderStatus> {
    let sections = parseSectionsJson(sectionsRaw);
    let caseLaws = parseCaseLawsJson(caseLawsRaw);
    let amendments = parseAmendmentsJson(amendmentsRaw);
    let studyNotes = parseStudyNotesJson(studyNotesRaw);
    let acts = parseActsJson(actsRaw);
    let circulars = parseCircularsJson(circularsRaw);
    let notifications = parseNotificationsJson(notificationsRaw);
    let rules = parseRulesJson(rulesRaw);
    let forms = parseFormsJson(formsRaw);
    let faqs = parseFaqsJson(faqsRaw);

    let isDemo = false;

    // Check if primary dataset is empty → Fall back to demo dataset
    if (sections.length === 0) {
      isDemo = true;
      const sec1961Demo = parseSectionsJson(act1961Demo);
      const sec2025Demo = parseSectionsJson(act2025Demo);
      sections = [...sec1961Demo, ...sec2025Demo];
      caseLaws = parseCaseLawsJson(caseLawsDemo);
      amendments = parseAmendmentsJson(amendmentsDemo);
      studyNotes = parseStudyNotesJson(studyNotesDemo);
    }

    // Populate Repositories
    actRepository.loadActModels(acts);
    sectionRepository.loadSectionModels(sections);
    caseLawRepository.loadCaseLawModels(caseLaws);
    amendmentRepository.loadAmendmentModels(amendments);
    circularRepository.loadCircularModels(circulars);
    notificationRepository.loadAll(notifications);
    ruleRepository.loadAll(rules);
    formRepository.loadAll(forms);
    faqRepository.loadAll(faqs);
    studyNoteRepository.loadAll(studyNotes);

    // Index repositories into search engine
    await searchIndexService.indexAllRepositories();

    this.status = {
      loaded: true,
      isDemoDataset: isDemo,
      actsCount: acts.length,
      sectionsCount: sections.length,
      caseLawsCount: caseLaws.length,
      amendmentsCount: amendments.length,
      circularsCount: circulars.length,
      notificationsCount: notifications.length,
      rulesCount: rules.length,
      formsCount: forms.length,
      faqsCount: faqs.length,
      studyNotesCount: studyNotes.length,
    };

    return this.status;
  }

  getStatus(): DataLoaderStatus {
    return this.status;
  }
}

export const legalDataLoader = new LegalDataLoader();
