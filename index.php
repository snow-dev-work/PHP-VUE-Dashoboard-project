<?php

require_once './global.php';

// $JSON = "projets_a4086d45-219e-4855-95f1-5cbdacdf17f5.json";
/* $FROM = __DIR__ . "/" . $JSON;
$TO = __DIR__ . "/data/" . $JSON;
if (file_exists($FROM)) {
  rename($FROM, $TO);
} */

$path = explode("/", $_SERVER["REQUEST_URI"] ?? "");
array_shift($path);
if (empty($path)) {
  $path[] = "";
}
if (in_array($path[0], ["recette", "production"])) {
  array_shift($path);
}
if ($path[0] === "dashboard-projets") {
  array_shift($path);
}

$path = array_map(function ($e) {
  return preg_replace("/\?.*/", "", $e);
}, $path);

require_once "./model/xlsxwriter.class.php";
require_once "./model/USERS.php";
require_once "./model/STATUS.php";
require_once "./model/Event.php";
require_once "./model/Project.php";
require_once "./controller/DashboardController.php";
require_once "./controller/DashboardApiController.php";
require_once "./controller/DashboardFileController.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$DASHBOARD_CONTROLLER = new DashboardController();
$DASHBOARD_API_CONTROLLER = new DashboardApiController(DATA_PATH . DATA_FILE_NAME);
$DASHBOARD_FILE_CONTROLLER = new DashboardFileController(DATA_PATH);

try {
  switch ($path[0]) {
    case "api":
      if (empty($_SERVER["HTTP_AUTHORIZATION"])) {
        throw new Exception("Vous n'avez aucune autorisation", 401);
      }
      $token = preg_replace("/Bearer /", "", $_SERVER["HTTP_AUTHORIZATION"]);

      header("Content-type: application/json", false, 200);
      $method = $_SERVER["REQUEST_METHOD"];

      switch ($path[1]) {
        case "projects": {
            if (isset($path[2])) {
              if ($path[2] === "excel") {
                if ($method !== "POST")
                  throw new Exception("Une erreur s'est produite", 405);

                $body = json_decode(@file_get_contents("php://input"), true);

                $filename = "projets-" . date("Ymd", (new DateTime())->getTimestamp()) . ".xlsx";

                $sheetTitle = "Projets";
                $headers = [
                  "Projet"                => "string",
                  "Statut"                => "string",
                  "Date de départ"        => "string",
                  "Date de fin"           => "string",
                  "Demandeur"             => "string",
                  "Service"               => "string",
                  "Progression"           => "0 %",
                  "Référent Informatique" => "string",
                  "Référent Métier"       => "string",
                  "Domaine(s)"            => "string",
                  "Développeur(s)"        => "string",
                  "Temps consommé (JH)"   => "0",
                  "Estimation (JH)"       => "0"
                ];

                $rows = array_map(function ($id) use ($DASHBOARD_API_CONTROLLER, $token) {
                  $project = $DASHBOARD_API_CONTROLLER->getProject($token, $id);
                  return [
                    $project->getTitle(),
                    $project->getStatus(),
                    $project->getDateStart(),
                    $project->getDateEnd(),
                    $project->getApplicant(),
                    $project->getService(),
                    $project->getProgression() . " %",
                    $project->getReferentInfo(),
                    $project->getReferentBusiness(),
                    implode("\n", $project->getFields()),
                    implode("\n", $project->getDevelopers()),
                    $project->getTimeSpent(),
                    $project->getEstimation() ?? 0.0,
                  ];
                }, $body);

                $sheet = "Projets";

                $writer = new XLSXWriter();
                $row_header = [
                  "Projet",
                  "Statut",
                  "Date de départ",
                  "Date de fin",
                  "Demandeur",
                  "Service",
                  "Progression",
                  "Référent Informatique",
                  "Référent Métier",
                  "Domaine(s)",
                  "Développeur(s)",
                  "Temps consommé (JH)",
                  "Temps estimé (JH)",
                ];

                $writer->writeSheetHeader(
                  $sheet,
                  [
                    "string",
                    "string",
                    "string",
                    "string",
                    "string",
                    "string",
                    "string",
                    "string",
                    "string",
                    "string",
                    "string",
                    "string",
                    "string"
                  ],
                  [
                    "suppress_row" => true,
                    "widths"       => [100, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
                  ]
                );

                $writer->writeSheetRow($sheet, $row_header, [
                  "height"     => 50,
                  "halign"     => "center",
                  "valign"     => "center",
                  "font-size"  => "13",
                  "font-style" => "bold"
                ]);

                $row_style = [];
                foreach ($row_header as $key => $header) {
                  $style = [
                    "halign"    => "center",
                    "wrap_text" => true,
                    "valign"    => "center"
                  ];
                  if ($key === 0) {
                    $style["halign"] = "general";
                  }

                  $row_style[] = $style;
                }

                foreach ($rows as $row) {
                  $writer->writeSheetRow($sheet, $row, $row_style);
                }

                header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                header('Content-Disposition: attachment; filename="' . $filename . '"');

                $writer->writeToStdOut();
                break 2;
              }

              if ($path[2] === "date") {
                header("Access-Control-Allow-Methods: GET, OPTION");
                echo json_encode($DASHBOARD_API_CONTROLLER->update_date);
                break 2;
              }

              $matches = [];
              preg_match("/(?<id>\d+)/", $path[2], $matches);
              $id = intval($matches["id"]) ?? null;
              if (is_null($id))
                throw new Exception("Projet introuvable", 404);

              if (isset($path[3])) {
                switch ($path[3]) {
                  case "history":
                    if (isset($path[4])) {
                      $matches = [];
                      preg_match("/(?<event_id>\d+)/", $path[4], $matches);
                      $event_id = $matches["event_id"] ?? null;
                      if (is_null($event_id))
                        throw new Exception("Evénement introuvable", 404);

                      header("Access-Control-Allow-Methods: GET, PUT, DELETE, OPTION");
                      switch ($method) {
                        case "GET":
                          echo json_encode($DASHBOARD_API_CONTROLLER->getEvent($toke, $id, $event_id));
                          break 4;
                        case "PUT":
                          $body = json_decode(@file_get_contents("php://input"), true);
                          $event = $DASHBOARD_API_CONTROLLER->updateEvent($token, $id, $event_id, $body);
                          $project = $DASHBOARD_API_CONTROLLER->getProject($token, $id);

                          $users = $project->getUsers();
                          $users[] = "SUPERADMIN";
                          foreach ($project->getFields() as $field) {
                            $users[] = "{$field}_ADMIN";
                          }

                          mercure_push([
                            "type"    => "UPDATE_EVENT",
                            "event"   => $event,
                            "date"    => $DASHBOARD_API_CONTROLLER->update_date,
                            "message" => "Un événement du projet {$project->getTitle()} a été mis à jour"
                          ], $users);

                          echo json_encode($event);
                          break 4;
                        case "DELETE":
                          $event = $DASHBOARD_API_CONTROLLER->deleteEvent($token, $id, $event_id);
                          $project = $DASHBOARD_API_CONTROLLER->getProject($token, $id);
                          $users = $project->getUsers();
                          $users[] = "SUPERADMIN";
                          foreach ($project->getFields() as $field) {
                            $users[] = "{$field}_ADMIN";
                          }

                          mercure_push([
                            "type"    => "DELETE_EVENT",
                            "event"   => $event,
                            "date"    => $DASHBOARD_API_CONTROLLER->update_date,
                            "message" => "Un événement du projet {$project->getTitle()} a été supprimé",
                          ], $users);

                          echo json_encode($event);
                          break 4;
                      }
                    }

                    switch ($method) {
                      case "GET":
                        echo json_encode($DASHBOARD_API_CONTROLLER->getHistory($token, $id));
                        break 4;
                      case "POST":
                        http_response_code(201);
                        $body = json_decode(@file_get_contents("php://input"), true);
                        $event = $DASHBOARD_API_CONTROLLER->postEvent($token, $id, $body);
                        $project = $DASHBOARD_API_CONTROLLER->getProject($token, $id);
                        $users = $project->getUsers();
                        $users[] = "SUPERADMIN";
                        foreach ($project->getFields() as $field) {
                          $users[] = "{$field}_ADMIN";
                        }

                        mercure_push([
                          "type"    => "NEW_EVENT",
                          "event"   => $event,
                          "date"    => $DASHBOARD_API_CONTROLLER->update_date,
                          "message" => "Un nouvel événement à été ajouté au projet {$project->getTitle()}"
                        ], $users);

                        echo json_encode($event);
                        break 4;
                    }
                    break 3;
                }
              }

              header("Access-Control-Allow-Methods: GET, PUT, DELETE, OPTION");
              switch ($method) {
                case "GET":
                  echo json_encode($DASHBOARD_API_CONTROLLER->getProject($token, $id));
                  break 3;
                case "PUT":
                  $body = json_decode(@file_get_contents("php://input"), true);
                  $project = $DASHBOARD_API_CONTROLLER->getProject($token, $id);
                  $users_init = $project->getUsers();
                  $fields_init = $project->getFields();

                  $project = $DASHBOARD_API_CONTROLLER->updateProject($token, $id, $body);
                  $users = $project->getUsers();
                  $fields = $project->getFields();

                  $users_include = array_diff($users, $users_init);
                  foreach (array_diff($fields, $fields_init) as $field) {
                    $users_include[] = "{$field}_ADMIN";
                  }

                  $users_exclude = array_diff($users_init, $users);
                  foreach (array_diff($fields_init, $fields) as $field) {
                    $users_exclude[] = "{$field}_ADMIN";
                  }

                  $users[] = "SUPERADMIN";
                  foreach ($fields as $field) {
                    $users[] = "{$field}_ADMIN";
                  }
                  $users = array_diff($users, $users_include);


                  mercure_push([
                    "type"    => "UPDATE_PROJECT",
                    "project" => $project,
                    "date"    => $DASHBOARD_API_CONTROLLER->update_date,
                    "message" => "Un projet a été mis à jour: {$project->getTitle()}"
                  ], $users);
                  mercure_push([
                    "type"    => "DELETE_PROJECT",
                    "project" => $project,
                    "date"    => $DASHBOARD_API_CONTROLLER->update_date,
                    "message" => "Vous n'avez plus accès aux informations concernant le projet suivant: {$project->getTitle()}"
                  ], $users_exclude);
                  mercure_push([
                    "type"    => "NEW_PROJECT",
                    "project" => $project,
                    "date"    => $DASHBOARD_API_CONTROLLER->update_date,
                    "message" => "Vous avez maintenant accès aux informations concernant le projet suivant : {$project->getTitle()}"
                  ], $users_include);

                  echo json_encode($project);
                  break 3;
                case "DELETE":
                  $project = $DASHBOARD_API_CONTROLLER->deleteProject($token, $id);
                  $DASHBOARD_FILE_CONTROLLER->deleteAll($project->getId());

                  $users = $project->getUsers();
                  $users[] = "SUPERADMIN";

                  foreach ($project->getFields() as $field) {
                    $users[] = "{$field}_ADMIN";
                  }

                  mercure_push([
                    "type"    => "DELETE_PROJECT",
                    "project" => $project,
                    "date"    => $DASHBOARD_API_CONTROLLER->update_date,
                    "message" => "Le projet {$project->getTitle()} a été supprimé"
                  ], $users);

                  echo json_encode($project);
                  break 3;
              }
              break 2;
            }

            header("Access-Control-Allow-Methods: GET, POST, OPTION");
            switch ($method) {
              case "GET":
                echo json_encode($DASHBOARD_API_CONTROLLER->getProjects($token));
                break 3;
              case "POST":
                http_response_code(201);
                $body = json_decode(@file_get_contents("php://input"), true);
                $project = $DASHBOARD_API_CONTROLLER->postProject($token, $body);
                $users = $project->getUsers();
                $users[] = "SUPERADMIN";

                foreach ($project->getFields() as $field) {
                  $users[] = "{$field}_ADMIN";
                }

                mercure_push([
                  "type"    => "NEW_PROJECT",
                  "project" => $project,
                  "date"    => $DASHBOARD_API_CONTROLLER->update_date,
                  "message" => "Un nouveau projet à été créé : {$project->getTitle()}"
                ], $users);

                echo json_encode($project);
                break 3;
            }
            break 2;
          }
        case "status": {
            header("Access-Control-Allow-Methods: GET, OPTION");
            echo json_encode(STATUS::json());
            break 2;
          }
        case "admin": {
            header("Access-Control-Allow-Methods: GET, OPTION");
            echo json_encode(USERS::isAdmin($token));
            break 2;
          }
        case "user": {
            header("Access-Control-Allow-Methods: GET, OPTION");
            echo json_encode(USERS::getUser($token));
            break 2;
          }
      }
      break;

    case "files":
      if (empty($_SERVER["HTTP_AUTHORIZATION"])) {
        throw new Exception("Vous n'avez aucune autorisation", 401);
      }
      $token = preg_replace("/Bearer /", "", $_SERVER["HTTP_AUTHORIZATION"]);

      header("Content-type: application/json", false, 200);
      $method = $_SERVER["REQUEST_METHOD"];

      if (isset($path[1])) {
        $matches = [];
        preg_match("/(?<id>\d+)/", $path[1], $matches);
        $id = intval($matches["id"]) ?? null;
        if (is_null($id))
          throw new Exception("Projet introuvable", 404);

        switch ($method) {
          case "GET":
            $DASHBOARD_FILE_CONTROLLER->getFile($id);
            break 2;

          case "DELETE":
            $file = $DASHBOARD_FILE_CONTROLLER->delete($id);
            if ($file === false) {
              throw new Exception("Fichier introuvable", 500);
            }

            $project = $DASHBOARD_API_CONTROLLER->getProject($token, $file->getProjectId());
            $users = $project->getUsers();
            $users[] = "SUPERADMIN";
            foreach ($project->getFields() as $field) {
              $users[] = "{$field}_ADMIN";
            }

            mercure_push([
              "type"    => "DELETE_FILE",
              "file"    => $file,
              "message" => "Le document {$file->getFilename()} a été supprimé du projet {$project->getTitle()}"
            ], $users);

            echo json_encode($file);
            break 2;
        }
      }

      switch ($method) {
        case "GET":
          echo $DASHBOARD_FILE_CONTROLLER->getJson();
          break 2;
        case "POST":
          $file = $_FILES["file"];
          $description = $_POST["description"];
          $project_id = $_POST["project_id"];

          $file = $DASHBOARD_FILE_CONTROLLER->add($file, $description, $project_id);
          if ($file === false) {
            throw new Exception("Impossible d'ajouter ce document", 500);
          }

          $project = $DASHBOARD_API_CONTROLLER->getProject($token, $project_id);
          $users = $project->getUsers();
          $users[] = "SUPERADMIN";
          foreach ($project->getFields() as $field) {
            $users[] = "{$field}_ADMIN";
          }

          mercure_push([
            "type"    => "NEW_FILE",
            "file"    => $file,
            "message" => "Un nouveau document a été ajouté au projet {$project->getTitle()}"
          ], $users);

          echo json_encode($file);
          break 2;
      }
      break;

    case "table":
      $DASHBOARD_CONTROLLER->table();
      break;

    case "availability":
      $token = $_GET["token"] ?? "";

      if (isset($path[1]) && $path[1] === "data") {
        header("Content-type: application/json", false, 200);
        // if(empty($_SERVER["HTTP_AUTHORIZATION"])) { throw new Exception("Vous n'avez aucune autorisation", 401); }
        // $token = preg_replace("/Bearer /", "", $_SERVER["HTTP_AUTHORIZATION"]);

        if (isset($path[2]) && $path[2] === "etp") {
          if (isset($path[3])) {
            $MYSQL_CONNECTION = new PDO("mysql:host=172.22.1.7;dbname=xtime;charset=utf8;port=3306", "xtime", "xtime");
            $matches = [];
            preg_match("/^(?<year>\d{4})-(?<month>\d{2})$/", $path[3], $matches);
            $date_exit = intval($matches["year"] . $matches["month"] . "01");
            $date_enter = intval($matches["year"] . $matches["month"] . "31");
            $SQL = "SELECT COUNT(*) as ETP
              FROM essai2 e
              WHERE CT_JO != '' AND e.ENTRL <= :date_enter AND (e.DAT_F_BADG = 0 OR e.DAT_F_BADG >= :date_exit) AND e.MATRICULE != '3000003' AND e.AVENANT != ''
              ORDER BY e.DAT_F_BADG DESC
            ";
            $data = $MYSQL_CONNECTION->prepare($SQL);
            $data->execute([
              "date_enter" => $date_enter,
              "date_exit"  => $date_exit
            ]);
            $ETP = $data->fetch(PDO::FETCH_ASSOC);
            echo json_encode($ETP);
            break;
          }
          break;
        }

        $SQLSRV_CONNECTION = new PDO("sqlsrv:Server=172.22.1.54,1433;Database=ifc_web", "AccesWeb", "norad1304");
        $SQL = "SELECT * from I001_INFRA_SUPPORT";
        $data = $SQLSRV_CONNECTION->query($SQL, PDO::FETCH_ASSOC);
        $anomalies = $data->fetchAll();

        $workload = json_decode(@file_get_contents(__DIR__ . "/out.json"), true);

        echo json_encode(["anomalies" => $anomalies, "workload" => $workload["data"]]);
        break;
      }

      $user = USERS::getUser($token);
      if (in_array($user, ["SUPERADMIN", "DIRECTION"])) {
        $DASHBOARD_CONTROLLER->availability();
      } else {
        header("Location: /?token=$token");
      }
      break;

    case "timeline":
      echo $DASHBOARD_CONTROLLER->timeline();
      break;
    /* case "events":
    require "./events.php";
    break; */
    case "mobile":
    case "":
    default:
      $DASHBOARD_CONTROLLER->mobile();
      exit;
  }
} catch (PDOException $e) {
  http_response_code($e->getCode());
  echo json_encode(["error" => $e->getMessage()]);
} catch (Exception $e) {
  http_response_code($e->getCode());
  echo json_encode(["error" => $e->getMessage()]);
}

function mercure_push($data, $users) {
  foreach (SERVERS_NAMES as $ENV => $SERVER_NAME) {
    if ($_SERVER["SERVER_NAME"] === $SERVER_NAME) {
      foreach ($users as $user) {
        $DATA = http_build_query([
          "topic" => MERCURE_TOPICS[$ENV][$user],
          "data"  => json_encode($data)
        ]);
        $CONTEXT = stream_context_create([
          "http" => [
            "method"  => "POST",
            "header"  => "Content-type: application/x-www-form-urlencoded\r\nAuthorization: Bearer " . MERCURE_JWTS[$ENV],
            "content" => $DATA
          ]
        ]);
        @file_get_contents(MERCURE_URL, false, $CONTEXT);
      }
      return;
    }
  }
}