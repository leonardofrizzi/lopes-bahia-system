// src/components/dashboard/LinksUteisComponent.tsx
"use client";

// Interface para links
interface Link {
  id: string;
  title: string;
  url: string;
  icon: React.ReactNode;
}

export default function LinksUteisComponent() {
  // Ícone de calculadora
  const calculatorIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );

  // Ícone de site/globo
  const websiteIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );

  // Lista de links
  const links: Link[] = [
    {
      id: '1',
      title: 'CALCULADORA HP-12C',
      url: 'https://epxx.co/ctb/hp12c.html',
      icon: calculatorIcon
    },
    {
      id: '2',
      title: 'CALCULADORA DE FINANCIAMENTO',
      url: 'https://www.mobills.com.br/calculadoras/simulador-de-financiamento-imobiliario/',
      icon: calculatorIcon
    },
    {
      id: '3',
      title: 'INDICADORES ECONÔMICOS',
      url: 'https://www.bcb.gov.br/estatisticas',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: '4',
      title: 'SITE DA PRONTOS',
      url: 'https://lopesnet.contact2sale.com/webapp',
      icon: websiteIcon
    },
    {
      id: '5',
      title: 'SITE LOPESNET CONTATOS',
      url: 'https://lopesnet.contact2sale.com/webapp',
      icon: websiteIcon
    },
    {
      id: '6',
      title: 'CHATGPT',
      url: 'https://chat.openai.com',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Links Úteis</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Lista de links em grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map(link => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex items-center space-x-4 group"
            >
              {/* Ícone do link */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {link.icon}
                </div>
              </div>
              
              {/* Título do link */}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 group-hover:text-[#eb194b] transition-colors">
                  {link.title}
                </h3>
              </div>
              
              {/* Ícone de link externo */}
              <div className="text-gray-400 group-hover:text-[#eb194b] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
