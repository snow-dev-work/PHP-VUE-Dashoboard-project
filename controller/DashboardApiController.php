<?php

class DashboardApiController {
  /** @var string */private $path;
  /** @var Project[] */private $projects;
  /** @var string */public $update_date;
  /** @var bool */private $error = false;

  public function __construct(string $path) {
    $this->path = $path;
    $this->fetch();
  }

  private function save() {
    $update_date = date("Y-m-d");
    $bytes = @file_put_contents($this->path, json_encode([
      "update_date" => $update_date,
      "projects"    => $this->projects
    ]));

    if ($bytes === false) {
      throw new Exception("Impossible de sauvegarder les données", 500);
    }

    $this->update_date = $update_date;
  }

  private function fetch() {
    $data_json = @file_get_contents($this->path);
    echo ($this->path);
    if ($data_json === false) {
      $this->error = true;
      throw new Exception("Impossible de lire le fichier", 500);
    }

    $data = json_decode($data_json, true);
    if (is_null($data)) {
      $this->error = true;
      throw new Exception("Données corrompues", 500);
    }

    $this->update_date = $data["update_date"] ?? $data["updateDate"];
    $this->projects = array_map(
      function ($project) {
        return new Project(
          $project["id"],
          $project["title"],
          $project["service"],
          $project["status"],
          $project["progression"],
          $project["priority"],
          array_key_exists('clickup', $project) ? $project['clickup'] : $project['link'],
          array_key_exists('clickup', $project) ? $project["link"] : null,
          $project["description"],
          $project["date_start"],
          $project["date_end"],
          $project["referent_info"] ?? $project["referentInfo"] ?? null,
          $project["referent_business"] ?? $project["referentBusiness"] ?? null,
          $project["applicant"],
          $project["developers"],
          $project["users"],
          $project["fields"],
          array_map(
            function ($event) use ($project) {
                return new Event(
                  $event['id'],
                  $event["date"],
                  $project["id"],
                  $event["message"],
                  $event["author"],
                );
              },
            $project["history"]
          ),
          $project["timeSpent"] ?? 0.0,
          $project["estimation"] ?? null
        );
      },
      $data["projects"]
    );
  }

  /** @return Project[] */
  public function getProjects(string $token): array {
    $user = USERS::getUser($token);
    if (is_null($user))
      return [];
    if (USERS::isSuperAdmin($token))
      return $this->projects;

    if (USERS::isAdmin($token)) {
      return array_values(
        array_filter(
          $this->projects,
          function (Project $project) use ($user) {
            return in_array(preg_replace("/_ADMIN/", "", $user), $project->getFields());
          }
        )
      );
    }

    return array_values(
      array_filter(
        $this->projects,
        function (Project $project) use ($user) {
          return in_array($user, $project->getUsers());
        }
      )
    );
  }

  public function getProject(string $token, int $id): ?Project {
    $projects = $this->getProjects($token);
    $search = array_values(
      array_filter(
        $projects,
        function (Project $project) use ($id) {
          return $project->getId() === $id;
        }
      )
    );
    if (count($search) !== 1)
      throw new Exception("Projet introuvable", 404);

    return $search[0];
  }

  public function postProject(string $token, array $body): ?Project {
    if (USERS::isAdmin($token)) {
      $project = Project::create(
        $body["title"],
        $body["service"],
        $body["status"] ?? STATUS::WAITING,
        $body["progression"] ?? 0,
        $body["priority"] ?? false,
        $body["clickup"] ?? null,
        $body["link"] ?? null,
        $body["description"] ?? null,
        $body["date_start"] ?? null,
        $body["date_end"] ?? null,
        $body["referent_info"] ?? null,
        $body["referent_business"] ?? null,
        $body["applicant"] ?? null,
        $body["developers"] ?? [],
        $body["users"] ?? [],
        $body["fields"] ?? [],
        $body["timeSpent"] ?? 0.0,
        $body["estimation"] ?? null
      );
      $this->projects[] = $project;
      $this->save();
      return $project;
    }

    throw new Exception("Vous n'avez pas les droits nécessaires", 401);
  }

  public function updateProject(string $token, int $id, array $body): ?Project {
    $project = $this->getProject($token, $id);

    if (isset($body["title"]))
      $project->setTitle($body["title"]);
    if (isset($body["status"]))
      $project->setStatus($body["status"]);
    if (isset($body["service"]))
      $project->setService($body["service"]);
    if (isset($body["progression"]))
      $project->setProgression($body["progression"]);
    if (isset($body["description"]))
      $project->setDescription($body["description"]);
    if (isset($body["users"]))
      $project->setUsers($body["users"]);
    if (isset($body["fields"]))
      $project->setFields($body["fields"]);
    if (isset($body["history"]))
      $project->setHistory($body["history"]);

    $project
      ->setPriority($body["priority"] ?? false)
      ->setDescription($body["description"] ?? null)
      ->setReferentInfo($body["referent_info"] ?? null)
      ->setReferentBusiness($body["referent_business"] ?? null)
      ->setApplicant($body["applicant"] ?? null)
      ->setDevelopers($body["developers"] ?? [])
      ->setTimeSpent($body["timeSpent"] ?? 0.0)
      ->setEstimation($body["estimation"] ?? null)
      ->setClickup($body["clickup"] ?? null)
      ->setLink($body["link"] ?? null)
      ->setDateStart($body["date_start"])
      ->setDateEnd($body["date_end"]);

    $this->save();
    return $project;
  }

  public function deleteProject(string $token, int $id): ?Project {
    $project = $this->getProject($token, $id);
    $this->projects = array_values(
      array_filter(
        $this->projects,
        function (Project $p) use ($project) {
          return $p->getId() !== $project->getId();
        }
      )
    );

    $this->save();
    return $project;
  }

  /** @return Event[] */
  public function getHistory(string $token, int $id): array {
    $project = $this->getProject($token, $id);
    return $project->getHistory();
  }

  public function getEvent(string $token, int $project_id, int $id): ?Event {
    $project = $this->getProject($token, $project_id);
    $search = array_values(
      array_filter(
        $project->getHistory(),
        function (Event $event) use ($id) {
          return $event->getId() === $id;
        }
      )
    );
    if (count($search) !== 1)
      throw new Exception("Evénement introuvable", 404);

    return $search[0];
  }

  public function postEvent(string $token, int $id, array $body): ?Event {
    $project = $this->getProject($token, $id);
    if (USERS::isAdmin($token)) {
      $event = Event::create(
        $body["date"],
        $id,
        $body["message"],
        $body["author"] ?? null
      );
      $project->addEvent($event);
      $this->save();
      return $event;
    }

    throw new Exception("Vous n'avez pas les droits suffisants", 401);
  }

  public function updateEvent(string $token, int $project_id, int $id, array $body): ?Event {
    $event = $this->getEvent($token, $project_id, $id);

    if (isset($body["date"]))
      $event->setDate($body["date"]);
    if (isset($body["message"]))
      $event->setMessage($body["message"]);
    if (isset($body["author"]))
      $event->setAuthor($body["author"]);

    $this->save();
    return $event;
  }

  public function deleteEvent(string $token, int $project_id, int $id): ?Event {
    $project = $this->getProject($token, $project_id);
    $event = $this->getEvent($token, $project_id, $id);

    $project->removeEvent($id);

    $this->save();
    return $event;
  }
}