<?php

class Project implements JsonSerializable {
  /** @var int */private static $LAST_ID = 0;

  /** @var int */private $id;
  /** @var string */private $title;
  /** @var string */private $service;
  /** @var string */private $status = STATUS::WAITING;
  /** @var int */private $progression = 0;
  /** @var bool */private $priority = false;
  /** @var string|null */private $clickup = null;
  /** @var string|null */private $link = null;
  /** @var string|null */private $description = null;
  /** @var string|null */private $date_start = null;
  /** @var string|null */private $date_end = null;
  /** @var string|null */private $referent_info = null;
  /** @var string|null */private $referent_business = null;
  /** @var string|null */private $applicant = null;
  /** @var string[] */private $users = [];
  /** @var string[] */private $fields = [];
  /** @var string[] */private $developers = [];
  /** @var Event[] */private $history = [];
  /** @var float */private $timeSpent = 0.0;
  /** @var float|null */private $estimation = null;

  public function __construct(
    int $id,
    string $title,
    string $service,
    ?string $status,
    ?int $progression,
    ?bool $priority,
    ?string $clickup,
    ?string $link,
    ?string $description,
    ?string $date_start,
    ?string $date_end,
    ?string $referent_info,
    ?string $referent_business,
    ?string $applicant,
    array $developers,
    array $users,
    array $fields,
    array $history,
    ?float $timeSpent,
    ?float $estimation
  ) {
    $this
      ->setId($id)
      ->setTitle($title)
      ->setService($service)
      ->setStatus($status)
      ->setProgression($progression)
      ->setPriority($priority)
      ->setClickup($clickup)
      ->setLink($link)
      ->setDescription($description)
      ->setDateStart($date_start)
      ->setDateEnd($date_end)
      ->setReferentInfo($referent_info)
      ->setReferentBusiness($referent_business)
      ->setApplicant($applicant)
      ->setDevelopers($developers)
      ->setUsers($users)
      ->setFields($fields)
      ->setHistory($history)
      ->setTimeSpent($timeSpent)
      ->setEstimation($estimation);

    if ($id > self::$LAST_ID)
      self::$LAST_ID = $id;
  }

  public static function create(
    string $title,
    string $service,
    ?string $status,
    ?int $progression,
    ?bool $priority,
    ?string $clickup,
    ?string $link,
    ?string $description,
    ?string $date_start,
    ?string $date_end,
    ?string $referent_info,
    ?string $referent_business,
    ?string $applicant,
    array $developers,
    array $users,
    array $fields,
    ?float $timeSpent,
    ?float $estimation
  ): self {
    $id = self::$LAST_ID + 1;

    return new self(
      $id,
      $title,
      $service,
      $status,
      $progression,
      $priority,
      $clickup,
      $link,
      $description,
      $date_start,
      $date_end,
      $referent_info,
      $referent_business,
      $applicant,
      $developers,
      $users,
      $fields,
      [],
      $timeSpent,
      $estimation
    );
  }

  public function getId(): int {
    return $this->id;
  }
  public function getTitle(): string {
    return $this->title;
  }
  public function getService(): string {
    return $this->service;
  }
  public function getStatus(): string {
    return $this->status;
  }
  public function getProgression(): int {
    return $this->progression;
  }
  public function getPriority(): bool {
    return $this->priority;
  }
  public function getClickup(): ?string {
    return $this->clickup;
  }
  public function getLink(): ?string {
    return $this->link;
  }
  public function getDescription(): ?string {
    return $this->description;
  }
  public function getDateStart(): ?string {
    return $this->date_start;
  }
  public function getDateEnd(): ?string {
    return $this->date_end;
  }
  public function getReferentInfo(): ?string {
    return $this->referent_info;
  }
  public function getReferentBusiness(): ?string {
    return $this->referent_business;
  }
  public function getApplicant(): ?string {
    return $this->applicant;
  }
  public function getUsers(): array {
    return $this->users;
  }
  public function getFields(): array {
    return $this->fields;
  }
  public function getDevelopers(): array {
    return $this->developers;
  }
  public function getHistory(): array {
    return $this->history;
  }

  private function setId(int $id): self {
    $this->id = $id;
    return $this;
  }
  public function setTitle(string $title): self {
    $this->title = $title;
    return $this;
  }
  public function setService(string $service): self {
    $this->service = $service;
    return $this;
  }
  public function setStatus(?string $status): self {
    $this->status = $status;
    return $this;
  }
  public function setProgression(?int $progression): self {
    $this->progression = $progression;
    return $this;
  }
  public function setPriority(?bool $priority): self {
    $this->priority = $priority;
    return $this;
  }
  public function setClickup(?string $clickup): self {
    $this->clickup = $clickup;
    return $this;
  }
  public function setLink(?string $link): self {
    $this->link = $link;
    return $this;
  }
  public function setDescription(?string $description): self {
    $this->description = $description;
    return $this;
  }
  public function setDateStart(?string $date): self {
    $this->date_start = $date;
    return $this;
  }
  public function setDateEnd(?string $date): self {
    $this->date_end = $date;
    return $this;
  }
  public function setReferentInfo(?string $referent): self {
    $this->referent_info = $referent;
    return $this;
  }
  public function setReferentBusiness(?string $referent): self {
    $this->referent_business = $referent;
    return $this;
  }
  public function setApplicant(?string $applicant): self {
    $this->applicant = $applicant;
    return $this;
  }
  public function setUsers(array $users): self {
    $this->users = $users;
    return $this;
  }
  public function setFields(array $fields): self {
    $this->fields = $fields;
    return $this;
  }
  public function setDevelopers(array $developers): self {
    $this->developers = $developers;
    return $this;
  }
  public function setHistory(array $history): self {
    $this->history = $history;
    return $this;
  }
  public function addEvent(Event $event): self {
    $this->history[] = $event;
    return $this;
  }
  public function removeEvent(int $id): self {
    $this->history = array_values(
      array_filter(
        $this->history,
        function ($event) use ($id) {
          return $event->getId() !== $id;
        }
      )
    );
    return $this;
  }

  public function getTimeSpent(): float {
    return $this->timeSpent;
  }
  public function setTimeSpent(float $time): self {
    $this->timeSpent = $time;
    return $this;
  }

  public function getEstimation(): ?float {
    return $this->estimation;
  }

  public function setEstimation(?float $estimation): self {
    $this->estimation = $estimation;
    return $this;
  }

  public function jsonSerialize(): array {
    return [
      "id"                => $this->getId(),
      "title"             => $this->getTitle(),
      "users"             => $this->getUsers(),
      "date_start"        => $this->getDateStart(),
      "date_end"          => $this->getDateEnd(),
      "priority"          => $this->getPriority(),
      "progression"       => $this->getProgression(),
      "fields"            => $this->getFields(),
      "service"           => $this->getService(),
      "applicant"         => $this->getApplicant(),
      "status"            => $this->getStatus(),
      "description"       => $this->getDescription(),
      "clickup"           => $this->getClickup(),
      "link"              => $this->getLink(),
      "referent_info"     => $this->getReferentInfo(),
      "referent_business" => $this->getReferentBusiness(),
      "developers"        => $this->getDevelopers(),
      "history"           => $this->getHistory(),
      "timeSpent"        => $this->getTimeSpent(),
      "estimation"        => $this->getEstimation(),
    ];
  }
}