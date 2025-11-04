import { Building2, Mail, Phone, Sparkles, Award, Linkedin, Globe } from 'lucide-react';
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
              <div className="glass rounded-2xl p-6 border border-white/20 max-w-md">
                {/* Agent Profile Section */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {agentConfig.agentPhoto ? (
                      <img
                        src={agentConfig.agentPhoto}
                        alt={agentName}
                        className="w-16 h-16 rounded-full border-2 border-white/30 object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-2 border-white/30">
                        <span className="text-2xl font-bold text-white">
                          {agentName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Name and Title */}
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold text-white mb-1">{agentName}</h3>
                    <p className="text-sm text-blue-100 mb-2">{agentConfig.agentTitle}</p>

                    {/* Credentials Badges */}
                    {agentConfig.credentials?.certifications && agentConfig.credentials.certifications.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {agentConfig.credentials.certifications.map((cert, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 border border-yellow-400/30 text-yellow-100 text-xs font-semibold rounded"
                          >
                            <Award className="w-3 h-3" />
                            {cert}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {agentConfig.agentBio && (
                  <p className="text-sm text-blue-100 mb-4 italic">
                    "{agentConfig.agentBio}"
                  </p>
                )}

                {/* Trust Indicators */}
                {agentConfig.credentials && (
                  <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-white/10">
                    {agentConfig.credentials.yearsOfExperience && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{agentConfig.credentials.yearsOfExperience}+</p>
                        <p className="text-xs text-blue-100">Years Exp.</p>
                      </div>
                    )}
                    {agentConfig.credentials.clientsServed && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{agentConfig.credentials.clientsServed}+</p>
                        <p className="text-xs text-blue-100">Clients</p>
                      </div>
                    )}
                    {agentConfig.credentials.assetsUnderManagement && (
                      <div className="text-center">
                        <p className="text-xl font-bold text-white">{agentConfig.credentials.assetsUnderManagement}</p>
                        <p className="text-xs text-blue-100">AUM</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Contact Buttons */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {agentConfig.agentEmail && (
                    <a
                      href={`mailto:${agentConfig.agentEmail}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-150 text-sm"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="hidden sm:inline">Email</span>
                    </a>
                  )}
                  {agentConfig.agentPhone && (
                    <a
                      href={`tel:${agentConfig.agentPhone}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-150 text-sm"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{agentConfig.agentPhone}</span>
                    </a>
                  )}
                  {agentConfig.agentWebsite && (
                    <a
                      href={agentConfig.agentWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-150 text-sm"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="hidden sm:inline">Website</span>
                    </a>
                  )}
                </div>

                {/* Social Links */}
                {agentConfig.socialLinks && (
                  <div className="flex gap-2 pt-2 border-t border-white/10">
                    {agentConfig.socialLinks.linkedin && (
                      <a
                        href={agentConfig.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-150"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
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
