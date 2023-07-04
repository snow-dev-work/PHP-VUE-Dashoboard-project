<?php

class File implements JsonSerializable
{
  /** @var int */ private static $current_id = 0;

  /** @var int */ private $id;
  /** @var int */ private $project_id;
  /** @var string */ private $filename;
  /** @var string */ private $type;
  /** @var string */ private $path;
  /** @var string */ private $date;
  /** @var string */ private $description;

  public function __construct(
    int $id,
    int $project_id,
    string $filename,
    string $type,
    string $path,
    string $date,
    string $description
  ) {
    $this->id = $id;
    $this->project_id = $project_id;
    $this->filename = $filename;
    $this->type = $type;
    $this->path = $path;
    $this->date = $date;
    $this->description = $description;

    if ($id > self::$current_id) self::$current_id = $id;
  }

  public static function create(
    int $project_id,
    string $filename,
    string $type,
    string $path,
    string $description
  ): self {
    return new self(
      self::$current_id + 1,
      $project_id,
      $filename,
      $type,
      $path,
      (new DateTime("now", new DateTimeZone("Europe/Paris")))->format("Y-m-d H:i"),
      $description
    );
  }

  public function getId(): int
  {
    return $this->id;
  }
  public function getProjectId(): int
  {
    return $this->project_id;
  }
  public function getPath(): string
  {
    return $this->path;
  }
  public function getFilename(): string
  {
    return $this->filename;
  }
  public function getType(): string
  {
    return $this->type;
  }

  public function setPath(string $path): self
  {
    $this->path = $path;
    return $this;
  }
  public function setDate(string $date): self
  {
    $this->date = $date;
    return $this;
  }
  public function setDescription(string $description): self
  {
    $this->description = $description;
    return $this;
  }

  public function same(self $file): bool
  {
    if ($file->getProjectId() !== $this->project_id) return false;
    if ($file->getId() !== $this->id) return false;
    return true;
  }

  public function jsonSerialize(): array
  {
    return [
      "id" => $this->id,
      "project_id" => $this->project_id,
      "filename" => $this->filename,
      "type" => $this->type,
      "path" => $this->path,
      "date" => $this->date,
      "description" => $this->description
    ];
  }
}
