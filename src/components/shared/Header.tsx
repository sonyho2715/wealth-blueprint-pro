import { Building2, Mail, Phone, Sparkles } from 'lucide-react';
import { agentConfig } from '../../config/agent.config';

interface HeaderProps {
  agentName: string;
  platformName: string;
  platformTagline: string;
}

export default function Header({ agentName, platformName, platformTagline }: HeaderProps) {
  return (
    <header className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 shadow-xl border-b border-blue-800/50 overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 animate-slide-down">
              <div className="p-2.5 bg-white/20 rounded-xl border border-white/30 shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-2">
                  {platformName}
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </h1>
                <p className="text-blue-100 text-sm md:text-base font-medium mt-0.5">
                  {platformTagline}
                </p>
              </div>
            </div>
          </div>

          {agentConfig.features.showAgentBranding && (
            <div className="md:text-right animate-slide-down">
              <div className="glass rounded-2xl px-6 py-4 border border-white/20">
                <p className="text-xl font-bold text-white mb-1">{agentName}</p>
                <p className="text-sm text-blue-100 mb-3">{agentConfig.agentTitle}</p>
                <div className="flex flex-wrap items-center md:justify-end gap-3 text-sm">
                  {agentConfig.agentEmail && (
                    <a
                      href={`mailto:${agentConfig.agentEmail}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-150"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="hidden sm:inline">{agentConfig.agentEmail}</span>
                    </a>
                  )}
                  {agentConfig.agentPhone && (
                    <a
                      href={`tel:${agentConfig.agentPhone}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-150"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{agentConfig.agentPhone}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
    </header>
  );
}
