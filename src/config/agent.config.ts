/**
 * WHITE-LABEL AGENT CONFIGURATION
 *
 * This file allows you to customize the platform for different agents.
 * Simply update these values to rebrand the entire application.
 *
 * To create a new agent instance:
 * 1. Copy this file
 * 2. Update all fields below
 * 3. Deploy to a new domain/subdomain
 */

export interface AgentConfig {
  // Agent Information
  agentName: string;
  agentTitle: string;
  agentEmail: string;
  agentPhone: string;
  agentWebsite?: string;
  agentLogo?: string;

  // Company Information
  companyName: string;
  companyAddress?: string;

  // Branding
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };

  // Platform Settings
  platformName: string;
  platformTagline: string;

  // Features
  features: {
    showAgentBranding: boolean;
    allowClientSelfService: boolean;
    enableInsuranceProducts: boolean;
    enablePDFReports: boolean;
    enableEmailTemplates: boolean;
  };

  // Social Links (optional)
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

/**
 * DEFAULT CONFIGURATION - Sony Ho
 * Update these values to white-label for a new agent
 */
export const agentConfig: AgentConfig = {
  // Agent Information
  agentName: "Sony Ho",
  agentTitle: "Professional Financial Consultant",
  agentEmail: "mrsonyho@gmail.com",
  agentPhone: "(808) 383-7520",
  agentWebsite: "https://sonyho.com", // Update with real website
  agentLogo: undefined, // Path to logo image in /public folder

  // Company Information
  companyName: "Sony Ho Financial Services",
  companyAddress: undefined,

  // Branding Colors
  brandColors: {
    primary: "#0ea5e9", // Sky blue
    secondary: "#6366f1", // Indigo
    accent: "#10b981", // Green
  },

  // Platform Settings
  platformName: "Wealth Blueprint",
  platformTagline: "Professional Financial Planning Platform",

  // Features
  features: {
    showAgentBranding: true,
    allowClientSelfService: false,
    enableInsuranceProducts: true,
    enablePDFReports: true,
    enableEmailTemplates: true,
  },

  // Social Links
  socialLinks: {
    linkedin: "https://linkedin.com/in/sonyho",
    twitter: undefined,
    facebook: undefined,
  },
};

/**
 * Helper function to get agent display name
 */
export const getAgentDisplayName = (): string => {
  return agentConfig.agentName;
};

/**
 * Helper function to get full contact info
 */
export const getAgentContact = () => {
  return {
    name: agentConfig.agentName,
    title: agentConfig.agentTitle,
    email: agentConfig.agentEmail,
    phone: agentConfig.agentPhone,
    website: agentConfig.agentWebsite,
  };
};
