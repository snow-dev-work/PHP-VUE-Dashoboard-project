<?php

class Event implements JsonSerializable
{
  /** @var int */ private static $LAST_ID = 0;

  /** @var int */ private $id;
  /** @var string */ private $date;
  /** @var string|null */ private $author = null;
  /** @var string */ private $message;
  /** @var int */ private $project_id;

  public function __construct(
    int $id,
    string $date,
    int $project_id,
    string $message,
    ?string $author = null
  ) {
    $this
      ->setId($id)
      ->setDate($date)
      ->setProjectId($project_id)
      ->setAuthor($author)
      ->setMessage($message);

    if ($id > self::$LAST_ID) self::$LAST_ID = $id;
  }

  public static function create(
    string $date,
    int $project_id,
    string $message,
    ?string $author = null
  ): self {
    $id = self::$LAST_ID + 1;
    return new self(
      $id,
      $date,
      $project_id,
      $message,
      $author
    );
  }

  public function getId(): int
  {
    return $this->id;
  }
  public function getDate(): string
  {
    return $this->date;
  }
  public function getProjectId(): int
  {
    return $this->project_id;
  }
  public function getAuthor(): ?string
  {
    return $this->author;
  }
  public function getMessage(): string
  {
    return $this->message;
  }

  private function setId(int $id): self
  {
    $this->id = $id;
    return $this;
  }
  public function setDate(string $date): self
  {
    $this->date = $date;
    return $this;
  }
  public function setProjectId(int $project_id): self
  {
    $this->project_id = $project_id;
    return $this;
  }
  public function setAuthor(?string $author): self
  {
    $this->author = $author;
    return $this;
  }
  public function setMessage(string $message): self
  {
    $this->message = $message;
    return $this;
  }

  public function jsonSerialize(): array
  {
    return [
      "id" => $this->id,
      "date" => $this->date,
      "author" => $this->author,
      "message" => $this->message,
      "project_id" => $this->project_id
    ];
  }
}
