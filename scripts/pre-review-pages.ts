import { loadAuditCatalog } from "./optimization/catalog";
import { expectedPages } from "./optimization/rendered";
console.log(JSON.stringify(expectedPages(loadAuditCatalog(), new Date())));
