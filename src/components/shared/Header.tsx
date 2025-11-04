import { Building2, Mail, Phone } from 'lucide-react';
import { agentConfig } from '../../config/agent.config';

interface HeaderProps {
  agentName: string;
  platformName: string;
  platformTagline: string;
}

export default function Header({ agentName, platformName, platformTagline }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              {platformName}
            </h1>
            <p className="text-sm text-gray-600 mt-1">{platformTagline}</p>
          </div>

          {agentConfig.features.showAgentBranding && (
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-lg font-semibold text-gray-900">{agentName}</p>
              <p className="text-sm text-gray-600">{agentConfig.agentTitle}</p>
              <div className="flex items-center justify-end gap-4 mt-2 text-sm text-gray-600">
                {agentConfig.agentEmail && (
                  <a
                    href={`mailto:${agentConfig.agentEmail}`}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="hidden sm:inline">{agentConfig.agentEmail}</span>
                  </a>
                )}
                {agentConfig.agentPhone && (
                  <a
                    href={`tel:${agentConfig.agentPhone}`}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{agentConfig.agentPhone}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
