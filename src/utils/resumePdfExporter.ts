import { jsPDF } from 'jspdf';

export interface ResumePdfOptions {
  fileName?: string;
  paperSize?: 'letter' | 'a4';
  accentTheme?: 'navy' | 'slate' | 'emerald' | 'indigo';
  accentColor?: [number, number, number]; // RGB, default: Slate Blue [30, 64, 175]
  candidateName?: string;
  targetRole?: string;
}

const ACCENT_COLOR_PRESETS: Record<string, [number, number, number]> = {
  navy: [30, 64, 175],     // Tech Navy Blue (#1E40AF)
  slate: [30, 41, 59],     // Executive Slate (#1E293B)
  emerald: [5, 150, 105],  // Emerald Green (#059669)
  indigo: [67, 56, 202],   // Modern Indigo (#4338CA)
};

/**
 * Strips markdown asterisks, backticks, and underscores while keeping text clean for PDF typography
 */
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}

interface ParsedResumeSection {
  title: string;
  lines: string[];
}

interface ParsedResume {
  name: string;
  contactLines: string[];
  sections: ParsedResumeSection[];
}

/**
 * Parses raw or AI-generated resume text into structured sections
 */
export function parseResumeText(rawText: string, fallbackName = 'Candidate Resume'): ParsedResume {
  const clean = rawText.replace(/\r\n/g, '\n').trim();
  const rawLines = clean.split('\n');

  let name = '';
  const contactLines: string[] = [];
  const sections: ParsedResumeSection[] = [];

  let currentSection: ParsedResumeSection | null = null;
  let inHeader = true;

  // Recognized Section Title patterns
  const sectionKeywords = [
    'SUMMARY',
    'PROFESSIONAL SUMMARY',
    'OBJECTIVE',
    'EDUCATION',
    'TECHNICAL SKILLS',
    'SKILLS',
    'CORE COMPETENCIES',
    'WORK EXPERIENCE',
    'PROFESSIONAL EXPERIENCE',
    'EXPERIENCE',
    'PROJECTS',
    'KEY PROJECTS',
    'ACADEMIC PROJECTS',
    'HONORS & LEADERSHIP',
    'HONORS AND LEADERSHIP',
    'HONORS & AWARDS',
    'LEADERSHIP',
    'CERTIFICATIONS',
    'PUBLICATIONS',
    'ACHIEVEMENTS',
    'VOLUNTEERING',
  ];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();
    if (!line) continue;

    // Check if line is a section header (e.g., "EDUCATION:", "## TECHNICAL SKILLS", "WORK EXPERIENCE")
    const normalized = line.replace(/^[#*\-_\s]+/, '').replace(/[:#*\-_]+$/, '').trim().toUpperCase();
    const isSectionHeader = sectionKeywords.some((keyword) => normalized === keyword || normalized.startsWith(keyword + ' '));

    if (isSectionHeader) {
      inHeader = false;
      currentSection = {
        title: normalized,
        lines: [],
      };
      sections.push(currentSection);
      continue;
    }

    if (inHeader) {
      if (!name) {
        // First non-empty line is candidate name
        name = line.replace(/^[#*\-\s]+/, '').replace(/[#*\-]+$/, '').trim();
      } else {
        // Following lines before first section are contact info
        contactLines.push(line);
      }
    } else if (currentSection) {
      currentSection.lines.push(line);
    }
  }

  return {
    name: name || fallbackName,
    contactLines,
    sections,
  };
}

/**
 * Generates and downloads a formatted, ATS-compliant PDF resume
 */
export function exportResumeAsPdf(
  resumeText: string,
  options: ResumePdfOptions = {}
): { success: boolean; fileName: string; error?: string } {
  try {
    const {
      paperSize = 'letter',
      accentTheme = 'navy',
      candidateName,
    } = options;

    const fallbackName = candidateName || 'Candidate Resume';

    const accentColor: [number, number, number] =
      options.accentColor ||
      (accentTheme && ACCENT_COLOR_PRESETS[accentTheme]) ||
      ACCENT_COLOR_PRESETS.navy;

    const parsed = parseResumeText(resumeText, fallbackName);

    // Page setup
    const doc = new jsPDF({
      unit: 'pt',
      format: paperSize,
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Margins: 36pt (0.5 in) left/right, 40pt top/bottom
    const marginLeft = 38;
    const marginRight = 38;
    const marginTop = 40;
    const marginBottom = 40;
    const contentWidth = pageWidth - marginLeft - marginRight;

    let y = marginTop;

    // Helper: Add new page when reaching bottom
    const checkPageBreak = (neededHeight: number): void => {
      if (y + neededHeight > pageHeight - marginBottom) {
        doc.addPage();
        y = marginTop;
      }
    };

    // --- 1. HEADER SECTION ---
    // Candidate Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(17, 24, 39); // Gray 900
    doc.text(cleanMarkdown(parsed.name), marginLeft, y);
    y += 18;

    // Contact Information (Email, Phone, Links)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(75, 85, 99); // Gray 600

    parsed.contactLines.forEach((contactLine) => {
      checkPageBreak(14);
      // Clean up common prefixes
      const cleaned = cleanMarkdown(
        contactLine
          .replace(/^Email:\s*/i, '')
          .replace(/^Phone:\s*/i, '')
          .replace(/^Location:\s*/i, '')
      );

      const splitContact = doc.splitTextToSize(cleaned, contentWidth);
      splitContact.forEach((cLine: string) => {
        doc.text(cLine, marginLeft, y);
        y += 11;
      });
    });

    // Top Header Divider
    y += 4;
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(1.5);
    doc.line(marginLeft, y, marginLeft + contentWidth, y);
    y += 14;

    // --- 2. RESUME SECTIONS ---
    parsed.sections.forEach((section) => {
      checkPageBreak(40);

      // Section Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text(cleanMarkdown(section.title), marginLeft, y);

      // Section Underline Rule
      y += 4;
      doc.setDrawColor(203, 213, 225); // Slate 300
      doc.setLineWidth(0.75);
      doc.line(marginLeft, y, marginLeft + contentWidth, y);
      y += 11;

      // Section Content
      for (let i = 0; i < section.lines.length; i++) {
        const line = section.lines[i];
        if (!line.trim()) continue;

        // Check if line is a Bullet Point
        const isBullet = /^([•\-*]|&bull;)\s+/.test(line);

        if (isBullet) {
          checkPageBreak(16);
          const bulletText = cleanMarkdown(line.replace(/^([•\-*]|&bull;)\s+/, ''));

          // Bullet dot
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
          doc.text('•', marginLeft + 4, y);

          // Bullet wrapped text
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(31, 41, 55); // Gray 800

          const bulletIndent = marginLeft + 14;
          const bulletWidth = contentWidth - 14;
          const wrappedLines = doc.splitTextToSize(bulletText, bulletWidth);

          wrappedLines.forEach((wLine: string, lineIdx: number) => {
            if (lineIdx > 0) checkPageBreak(12);
            doc.text(wLine, bulletIndent, y);
            y += 12;
          });
          y += 2; // slight spacing between bullets
        } else {
          // Check if line looks like a Sub-Heading (Company / Degree / Project title)
          // Often contains "—" or "–" or dates like "(May 2025 – Aug 2025)" or ":"
          const hasEmDash = line.includes('—') || line.includes(' – ') || line.includes(' - ');
          const hasDates = /\([12]\d{3}[^)]*\)/.test(line);

          if (hasEmDash || hasDates || line.includes('GPA:') || line.endsWith(':')) {
            checkPageBreak(22);
            y += 3;

            // Check if there are dates at the end e.g. (2022 - 2026) or (May 2025 – Aug 2025)
            const dateMatch = line.match(/\(([^)]*(?:20\d\d|19\d\d)[^)]*)\)$/);

            if (dateMatch) {
              const mainText = cleanMarkdown(line.substring(0, dateMatch.index));
              const dateText = cleanMarkdown(dateMatch[1]);

              // Main job/degree title
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(9.5);
              doc.setTextColor(17, 24, 39);
              doc.text(mainText, marginLeft, y);

              // Right-aligned date
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(9);
              doc.setTextColor(75, 85, 99);
              const dateWidth = doc.getTextWidth(dateText);
              doc.text(dateText, marginLeft + contentWidth - dateWidth, y);
              y += 13;
            } else {
              // Standard bold line or skill subcategory
              const isSkillsCategory = line.includes(':') && line.indexOf(':') < 28;

              if (isSkillsCategory) {
                const colonIdx = line.indexOf(':');
                const category = cleanMarkdown(line.substring(0, colonIdx + 1));
                const skillsList = cleanMarkdown(line.substring(colonIdx + 1));

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.setTextColor(17, 24, 39);
                doc.text(category, marginLeft, y);

                const catWidth = doc.getTextWidth(category) + 4;
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(55, 65, 81);

                const wrappedSkills = doc.splitTextToSize(skillsList, contentWidth - catWidth);
                if (wrappedSkills.length > 0) {
                  doc.text(wrappedSkills[0], marginLeft + catWidth, y);
                  for (let sIdx = 1; sIdx < wrappedSkills.length; sIdx++) {
                    y += 12;
                    checkPageBreak(12);
                    doc.text(wrappedSkills[sIdx], marginLeft + 14, y);
                  }
                }
                y += 13;
              } else {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9.5);
                doc.setTextColor(17, 24, 39);
                const wrapped = doc.splitTextToSize(cleanMarkdown(line), contentWidth);
                wrapped.forEach((w: string) => {
                  doc.text(w, marginLeft, y);
                  y += 13;
                });
              }
            }
          } else {
            // Standard paragraph line (e.g. Summary text)
            checkPageBreak(14);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(55, 65, 81); // Gray 700

            const wrappedParagraph = doc.splitTextToSize(cleanMarkdown(line), contentWidth);
            wrappedParagraph.forEach((pLine: string) => {
              doc.text(pLine, marginLeft, y);
              y += 12.5;
            });
            y += 2;
          }
        }
      }

      // Space after section
      y += 8;
    });

    // --- 3. PAGE NUMBERS & FOOTER ---
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175); // Gray 400

      // Subtle footer divider
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.5);
      doc.line(marginLeft, pageHeight - 26, marginLeft + contentWidth, pageHeight - 26);

      const footerText = `${parsed.name} — Professional Resume`;
      doc.text(footerText, marginLeft, pageHeight - 16);

      const pageNumText = `Page ${p} of ${totalPages}`;
      const pageNumWidth = doc.getTextWidth(pageNumText);
      doc.text(pageNumText, marginLeft + contentWidth - pageNumWidth, pageHeight - 16);
    }

    // Determine final output file name
    const safeName = (parsed.name || 'Candidate')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_');
    const finalFileName = options.fileName
      ? options.fileName.replace(/\.[^/.]+$/, '') + '.pdf'
      : `${safeName}_AI_Resume.pdf`;

    // Download generated PDF
    if (typeof window !== 'undefined') {
      doc.save(finalFileName);
    }

    return {
      success: true,
      fileName: finalFileName,
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error during PDF rendering';
    console.error('PDF Generation Error:', err);
    return {
      success: false,
      fileName: '',
      error: errMsg,
    };
  }
}
