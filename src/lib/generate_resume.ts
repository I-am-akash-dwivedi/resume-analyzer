import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export type resumeDataType = {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    links: {
      linkedin: string;
      github: string;
      portfolio: string;
    };
  };
  education: {
    degree: string;
    major: string;
    university: string;
    start_date: string;
    end_date: string;
    period: string;
    gpa: string;
  }[];
  workExperience: {
    company: string;
    location: string;
    title: string;
    start_date: string;
    end_date: string;
    period: string;
    description: string[];
  }[];
  skills: {
    languages: string[];
    frameworks: string[];
    databases: string[];
    tools: string[];
    functional_skills: string[];
  };
  projects: {
    title: string;
    start_date: string;
    end_date: string;
    link: string;
    description: string[];
  }[];
};

export const exportDocx = async (resumeData: resumeDataType) => {
  const { personalInfo, education, workExperience, skills, projects } =
    resumeData;
  const docContent = [];

  // Add Personal Information (conditionally)
  if (personalInfo.name) {
    docContent.push(
      new Paragraph({
        children: [
          new TextRun({ text: personalInfo.name, bold: true, size: 32 }),
        ],
        alignment: "center",
        spacing: { after: 200 },
      })
    );
  }
  const portfolio = personalInfo.links.portfolio;
  if (personalInfo.email || personalInfo.phone || personalInfo.links.linkedin) {
    docContent.push(
      new Paragraph({
        text: `${personalInfo.email || ""} ${
          personalInfo.phone ? "• " + personalInfo.phone : ""
        } ${
          personalInfo.links.linkedin ? "• " + personalInfo.links.linkedin : ""
        } ${
          personalInfo.links.github ? "• " + personalInfo.links.github : ""
        } ${portfolio ? "• " + portfolio : ""}`,
        alignment: "center",
        spacing: { after: 200 },
      })
    );
  }

  // Add Education Section
  if (education.length > 0) {
    docContent.push(
      new Paragraph({
        text: "Education",
        heading: "Heading1",
        spacing: { before: 300, after: 100 },
      })
    );
    education.forEach((edu) => {
      docContent.push(
        new Paragraph({
          children: [
            new TextRun({
              text: edu.university,
              bold: true,
            }),
            new TextRun({ text: `${edu.degree} in ${edu.major}` }),
            new TextRun({ text: ` (${edu.period})`, break: 1 }),
          ],
        })
      );
    });
  }

  // Add Work Experience
  if (workExperience.length > 0) {
    docContent.push(
      new Paragraph({
        text: "Work Experience",
        heading: "Heading1",
        spacing: { before: 300, after: 100 },
      })
    );
    workExperience.forEach((work) => {
      docContent.push(
        new Paragraph({
          children: [
            new TextRun({ text: work.company, bold: true }),
            new TextRun({ text: work.title, bold: true }),
            new TextRun({ text: work.period, italics: true }),
            ...work.description.map(
              (desc) =>
                new TextRun({
                  text: `• ${desc}`,
                  break: 1,
                })
            ),
          ],
        })
      );
    });
  }

  // Add Skills
  if (skills) {
    docContent.push(
      new Paragraph({
        text: "Skills",
        heading: "Heading1",
        spacing: { before: 300, after: 100 },
      })
    );

    // Iterate through each skill category
    Object.entries(skills).forEach(([key, value]) => {
      if (value.length > 0) {
        docContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${capitalizeFirstLetter(key)}: `,
                bold: true,
              }),
              new TextRun({
                text: value.join(", "),
              }),
            ],
            spacing: { after: 50 },
          })
        );
      }
    });
  }

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).replace("_", " ");
  }

  // Add Projects
  if (projects.length > 0) {
    docContent.push(
      new Paragraph({
        text: "Projects",
        heading: "Heading1",
        spacing: { before: 300, after: 100 },
      })
    );
    projects.forEach((project) => {
      docContent.push(
        new Paragraph({
          children: [
            new TextRun({ text: project.title, bold: true }),
            ...project.description.map(
              (desc) =>
                new TextRun({
                  text: `• ${desc}`,
                  break: 1,
                })
            ),
          ],
          spacing: { after: 100 },
        })
      );
    });
  }

  // Generate the document
  const doc = new Document({
    sections: [
      {
        children: docContent,
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "resume.docx");
  });
};
