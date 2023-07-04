<?php

define("MERCURE_URL", "https://rec-push-web.sgsante.fr/.well-known/mercure");
define("ENVS", ["DEV" => "DEV", "REC" => "REC", "PROD" => "PROD"]);
define("SERVERS_NAMES", [
  "DEV" => "localhost",
  "REC" => "rec-projets.ageo.fr",
  "PROD" => "projets.ageo.fr"
]);
define("MERCURE_TOPICS", [
  "DEV" => [
    "SUPERADMIN" => "http://dev-projets.ageo.fr/SUPERADMIN",
    "DEVELOPPEMENT_ADMIN" => "http://dev-projets.ageo.fr/DEVELOPPEMENT_ADMIN",
    "BI_ADMIN" => "http://dev-projets.ageo.fr/BI_ADMIN",
    "EDITIQUE_ADMIN" => "http://dev-projets.ageo.fr/EDITIQUE_ADMIN",
    "INFRA_ADMIN" => "http://dev-projets.ageo.fr/INFRA_ADMIN",
    "CAFETERIA_ADMIN" => "http://dev-projets.ageo.fr/CAFETERIA_ADMIN",
    "ESPACE_PARTENAIRE_ADMIN" => "http://dev-projets.ageo.fr/ESPACE_PARTENAIRE_ADMIN",
    "GESTION" => "http://dev-projets.ageo.fr/GESTION",
    "BACKOFFICE" => "http://dev-projets.ageo.fr/BACKOFFICE",
    "DIRECTION" => "http://dev-projets.ageo.fr/DIRECTION",
    "DSI" => "http://dev-projets.ageo.fr/DSI",
    "COTISATION" => "http://dev-projets.ageo.fr/COTISATION",
    "COMMISSIONS" => "http://dev-projets.ageo.fr/COMMISSIONS",
    "COMPTABILITE" => "http://dev-projets.ageo.fr/COMPTABILITE",
    "COMPLIANCE" => "http://dev-projets.ageo.fr/COMPLIANCE",
    "MARKETING" => "http://dev-projets.ageo.fr/MARKETING",
    "RH" => "http://dev-projets.ageo.fr/RH",
    "PREVOYANCE" => "http://dev-projets.ageo.fr/PREVOYANCE",
    "IARD" => "http://dev-projets.ageo.fr/IARD",
  ],
  "REC" => [
    "SUPERADMIN" => "http://rec-projets.ageo.fr/SUPERADMIN",
    "DEVELOPPEMENT_ADMIN" => "http://rec-projets.ageo.fr/DEVELOPPEMENT_ADMIN",
    "BI_ADMIN" => "http://rec-projets.ageo.fr/BI_ADMIN",
    "EDITIQUE_ADMIN" => "http://rec-projets.ageo.fr/EDITIQUE_ADMIN",
    "INFRA_ADMIN" => "http://rec-projets.ageo.fr/INFRA_ADMIN",
    "CAFETERIA_ADMIN" => "http://rec-projets.ageo.fr/CAFETERIA_ADMIN",
    "ESPACE_PARTENAIRE_ADMIN" => "http://rec-projets.ageo.fr/ESPACE_PARTENAIRE_ADMIN",
    "GESTION" => "http://rec-projets.ageo.fr/GESTION",
    "BACKOFFICE" => "http://rec-projets.ageo.fr/BACKOFFICE",
    "DIRECTION" => "http://rec-projets.ageo.fr/DIRECTION",
    "DSI" => "http://rec-projets.ageo.fr/DSI",
    "COTISATION" => "http://rec-projets.ageo.fr/COTISATION",
    "COMMISSIONS" => "http://rec-projets.ageo.fr/COMMISSIONS",
    "COMPTABILITE" => "http://rec-projets.ageo.fr/COMPTABILITE",
    "COMPLIANCE" => "http://rec-projets.ageo.fr/COMPLIANCE",
    "MARKETING" => "http://rec-projets.ageo.fr/MARKETING",
    "RH" => "http://rec-projets.ageo.fr/RH",
    "PREVOYANCE" => "http://rec-projets.ageo.fr/PREVOYANCE",
    "IARD" => "http://rec-projets.ageo.fr/IARD",
  ],
  "PROD" => [
    "SUPERADMIN" => "http://projets.ageo.fr/SUPERADMIN",
    "DEVELOPPEMENT_ADMIN" => "http://projets.ageo.fr/DEVELOPPEMENT_ADMIN",
    "BI_ADMIN" => "http://projets.ageo.fr/BI_ADMIN",
    "EDITIQUE_ADMIN" => "http://projets.ageo.fr/EDITIQUE_ADMIN",
    "INFRA_ADMIN" => "http://projets.ageo.fr/INFRA_ADMIN",
    "CAFETERIA_ADMIN" => "http://projets.ageo.fr/CAFETERIA_ADMIN",
    "ESPACE_PARTENAIRE_ADMIN" => "http://projets.ageo.fr/ESPACE_PARTENAIRE_ADMIN",
    "GESTION" => "http://projets.ageo.fr/GESTION",
    "BACKOFFICE" => "http://projets.ageo.fr/BACKOFFICE",
    "DIRECTION" => "http://projets.ageo.fr/DIRECTION",
    "DSI" => "http://projets.ageo.fr/DSI",
    "COTISATION" => "http://projets.ageo.fr/COTISATION",
    "COMMISSIONS" => "http://projets.ageo.fr/COMMISSIONS",
    "COMPTABILITE" => "http://projets.ageo.fr/COMPTABILITE",
    "COMPLIANCE" => "http://projets.ageo.fr/COMPLIANCE",
    "MARKETING" => "http://projets.ageo.fr/MARKETING",
    "RH" => "http://projets.ageo.fr/RH",
    "PREVOYANCE" => "http://projets.ageo.fr/PREVOYANCE",
    "IARD" => "http://projets.ageo.fr/IARD",
  ]
]);
define("MERCURE_JWTS", [
  "DEV" => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiaHR0cDovL2Rldi1wcm9qZXRzLmFnZW8uZnIvU1VQRVJBRE1JTiIsImh0dHA6Ly9kZXYtcHJvamV0cy5hZ2VvLmZyL0RFVkVMT1BQRU1FTlRfQURNSU4iLCJodHRwOi8vZGV2LXByb2pldHMuYWdlby5mci9CSV9BRE1JTiIsImh0dHA6Ly9kZXYtcHJvamV0cy5hZ2VvLmZyL0VESVRJUVVFX0FETUlOIiwiaHR0cDovL2Rldi1wcm9qZXRzLmFnZW8uZnIvSU5GUkFfQURNSU4iLCJodHRwOi8vZGV2LXByb2pldHMuYWdlby5mci9DQUZFVEVSSUFfQURNSU4iLCJodHRwOi8vZGV2LXByb2pldHMuYWdlby5mci9FU1BBQ0VfUEFSVEVOQUlSRV9BRE1JTiIsImh0dHA6Ly9kZXYtcHJvamV0cy5hZ2VvLmZyL0dFU1RJT04iLCJodHRwOi8vZGV2LXByb2pldHMuYWdlby5mci9CQUNLT0ZGSUNFIiwiaHR0cDovL2Rldi1wcm9qZXRzLmFnZW8uZnIvRElSRUNUSU9OIiwiaHR0cDovL2Rldi1wcm9qZXRzLmFnZW8uZnIvRFNJIiwiaHR0cDovL2Rldi1wcm9qZXRzLmFnZW8uZnIvQ09USVNBVElPTiIsImh0dHA6Ly9kZXYtcHJvamV0cy5hZ2VvLmZyL0NPTU1JU1NJT05TIiwiaHR0cDovL2Rldi1wcm9qZXRzLmFnZW8uZnIvQ09NUFRBQklMSVRFIiwiaHR0cDovL2Rldi1wcm9qZXRzLmFnZW8uZnIvQ09NUExJQU5DRSIsImh0dHA6Ly9kZXYtcHJvamV0cy5hZ2VvLmZyL01BUktFVElORyIsImh0dHA6Ly9kZXYtcHJvamV0cy5hZ2VvLmZyL1JIIiwiaHR0cDovL2Rldi1wcm9qZXRzLmFnZW8uZnIvUFJFVk9ZQU5DRSIsImh0dHA6Ly9kZXYtcHJvamV0cy5hZ2VvLmZyL0lBUkQiXX19.Y19fokLU7Copv8AltVxtU3femc2iWHKBiCBhfzt596Q",
  "REC" => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiaHR0cDovL3JlYy1wcm9qZXRzLmFnZW8uZnIvU1VQRVJBRE1JTiIsImh0dHA6Ly9yZWMtcHJvamV0cy5hZ2VvLmZyL0RFVkVMT1BQRU1FTlRfQURNSU4iLCJodHRwOi8vcmVjLXByb2pldHMuYWdlby5mci9CSV9BRE1JTiIsImh0dHA6Ly9yZWMtcHJvamV0cy5hZ2VvLmZyL0VESVRJUVVFX0FETUlOIiwiaHR0cDovL3JlYy1wcm9qZXRzLmFnZW8uZnIvSU5GUkFfQURNSU4iLCJodHRwOi8vcmVjLXByb2pldHMuYWdlby5mci9DQUZFVEVSSUFfQURNSU4iLCJodHRwOi8vcmVjLXByb2pldHMuYWdlby5mci9FU1BBQ0VfUEFSVEVOQUlSRV9BRE1JTiIsImh0dHA6Ly9yZWMtcHJvamV0cy5hZ2VvLmZyL0dFU1RJT04iLCJodHRwOi8vcmVjLXByb2pldHMuYWdlby5mci9CQUNLT0ZGSUNFIiwiaHR0cDovL3JlYy1wcm9qZXRzLmFnZW8uZnIvRElSRUNUSU9OIiwiaHR0cDovL3JlYy1wcm9qZXRzLmFnZW8uZnIvRFNJIiwiaHR0cDovL3JlYy1wcm9qZXRzLmFnZW8uZnIvQ09USVNBVElPTiIsImh0dHA6Ly9yZWMtcHJvamV0cy5hZ2VvLmZyL0NPTU1JU1NJT05TIiwiaHR0cDovL3JlYy1wcm9qZXRzLmFnZW8uZnIvQ09NUFRBQklMSVRFIiwiaHR0cDovL3JlYy1wcm9qZXRzLmFnZW8uZnIvQ09NUExJQU5DRSIsImh0dHA6Ly9yZWMtcHJvamV0cy5hZ2VvLmZyL01BUktFVElORyIsImh0dHA6Ly9yZWMtcHJvamV0cy5hZ2VvLmZyL1JIIiwiaHR0cDovL3JlYy1wcm9qZXRzLmFnZW8uZnIvUFJFVk9ZQU5DRSIsImh0dHA6Ly9yZWMtcHJvamV0cy5hZ2VvLmZyL0lBUkQiXX19.M2WcfP3wir-jtZDLB4QxoNOxx7E_oifoX6el8RZozTY",
  "PROD" => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiaHR0cDovL3Byb2pldHMuYWdlby5mci9TVVBFUkFETUlOIiwiaHR0cDovL3Byb2pldHMuYWdlby5mci9ERVZFTE9QUEVNRU5UX0FETUlOIiwiaHR0cDovL3Byb2pldHMuYWdlby5mci9CSV9BRE1JTiIsImh0dHA6Ly9wcm9qZXRzLmFnZW8uZnIvRURJVElRVUVfQURNSU4iLCJodHRwOi8vcHJvamV0cy5hZ2VvLmZyL0lORlJBX0FETUlOIiwiaHR0cDovL3Byb2pldHMuYWdlby5mci9DQUZFVEVSSUFfQURNSU4iLCJodHRwOi8vcHJvamV0cy5hZ2VvLmZyL0VTUEFDRV9QQVJURU5BSVJFX0FETUlOIiwiaHR0cDovL3Byb2pldHMuYWdlby5mci9HRVNUSU9OIiwiaHR0cDovL3Byb2pldHMuYWdlby5mci9CQUNLT0ZGSUNFIiwiaHR0cDovL3Byb2pldHMuYWdlby5mci9ESVJFQ1RJT04iLCJodHRwOi8vcHJvamV0cy5hZ2VvLmZyL0RTSSIsImh0dHA6Ly9wcm9qZXRzLmFnZW8uZnIvQ09USVNBVElPTiIsImh0dHA6Ly9wcm9qZXRzLmFnZW8uZnIvQ09NTUlTU0lPTlMiLCJodHRwOi8vcHJvamV0cy5hZ2VvLmZyL0NPTVBUQUJJTElURSIsImh0dHA6Ly9wcm9qZXRzLmFnZW8uZnIvQ09NUExJQU5DRSIsImh0dHA6Ly9wcm9qZXRzLmFnZW8uZnIvTUFSS0VUSU5HIiwiaHR0cDovL3Byb2pldHMuYWdlby5mci9SSCIsImh0dHA6Ly9wcm9qZXRzLmFnZW8uZnIvUFJFVk9ZQU5DRSIsImh0dHA6Ly9wcm9qZXRzLmFnZW8uZnIvSUFSRCJdfX0.W72dgITZlkh01dwEQPdty0egN-1VzxawrRMPZejYBHU"
]);

define('ROOT', __DIR__);
define('DATA_FILE_NAME', 'projets_a4086d45-219e-4855-95f1-5cbdacdf17f5.json');
define('DATA_PATH', ROOT . '/data/');

define('METHOD_GET', 'GET');
define('METHOD_POST', 'POST');
define('METHOD_PUT', 'PUT');
define('METHOD_PATCH', 'PATCH');
define('METHOD_DELETE', 'DELETE');

function dd(...$args)
{
  foreach ($args as $arg) {
    var_dump($arg);
  }
  die;
}
