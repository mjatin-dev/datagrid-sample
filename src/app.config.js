const environments = {
  development: "Development",
  production: "Production",
  uat: "UAT",
  pre_production: "Pre_Production",
  new_uat: "New_UAT",
};
const apiBaseUrls = {
  development: "https://dev.compliancesutra.com/api/method/",
  production: "https://prd.compliancesutra.com/api/method/",
  demo: "http://20.198.68.148/api/method/",
  scmTesting: "https://scmctestsite.in/api/method/",
  uat: "https://uatback.compliancesutra.com/api/method/",
  pre_production: "https://preprodback.compliancesutra.com/api/method/",
  new_uat: "https://brkscmcl.in/api/method/",
};
let currentEnvironment;

if (
  window.location.href.includes("localhost") ||
  window.location.href.includes("https://devsite.compliancesutra.com") ||
  window.location.href.includes("192.168.1")
) {
  currentEnvironment = environments.development;
} else if (window.location.href.includes("https://brkscmck.in")) {
  currentEnvironment = environments.new_uat;
} else if (
  window.location.href.includes("https://devsite.compliancesutra.com")
) {
  currentEnvironment = environments.development;
} else if (
  window.location.href.includes("https://uatreact.compliancesutra.com")
) {
  currentEnvironment = environments.uat;
} else if (
  window.location.href.includes("https://preprodreact.compliancesutra.com")
) {
  currentEnvironment = environments.pre_production;
} else {
  currentEnvironment = environments.production;
}
export const isShowProjectModule = ![environments.production].includes(
  currentEnvironment
);

export const isShowOtherComplianceModule = ![environments.production].includes(
  currentEnvironment
);

export const isShowAuditModule = ![environments.production].includes(
  currentEnvironment
);

export const isShowSmeModule = ![
  environments.production,
  environments.pre_production,
].includes(currentEnvironment);

export default currentEnvironment;
export { environments, apiBaseUrls };
