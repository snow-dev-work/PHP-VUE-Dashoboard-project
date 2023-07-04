<?php

require_once "./model/File.php";

class DashboardFileController {
  /** @var string */ private $FILES_DIRECTORY = "";
  /** @var string */ private $FILES_REGISTER = "";
  /** @var File[] */ private $files =[];

  public function __construct(string $path) {
    $this -> FILES_DIRECTORY = $path;
    if (!file_exists($this -> FILES_DIRECTORY)) { mkdir($this -> FILES_DIRECTORY, 0777, true); }

    $this -> FILES_REGISTER = preg_replace("/\/\/\/?/", "/", $this->FILES_DIRECTORY . "/files.json");
    if (!file_exists($this -> FILES_REGISTER)) { @file_put_contents($this -> FILES_REGISTER, json_encode([])); }

    $this -> fetch();
  }

  private function upload(string $from, string $to): bool { return move_uploaded_file($from, $to); }
  private function remove(string $path): bool { return unlink($path); }
  private function removeDir(string $path): bool { 
    if (!file_exists($path)) { return true; }
    if (!is_dir($path)) { return $this -> remove($path); }

    foreach (scandir($path) as $item) {
      if ($item === "." || $item === "..") { continue; }

      if (!$this -> removeDir($path . DIRECTORY_SEPARATOR . $item)) { return false; }
    }

    return rmdir($path);
   }
  private function save() {
    usort($this -> files, function($f1, $f2) {
      return $f1 -> getId() <=> $f2->getId();
    });
    return @file_put_contents($this -> FILES_REGISTER, json_encode($this -> getAll()));
  }

  private function exists(File $file) {
    foreach($this -> files as $f) {
      if ($f -> same($file)) return true;
    }
    return false;
  }

  private function fetch() {
    $files = json_decode(@file_get_contents($this -> FILES_REGISTER), true);
    if (is_null($files)) return;

    foreach($files as $file) {
      $this -> files[] = new File(
        $file["id"],
        $file["project_id"],
        $file["filename"],
        $file["type"],
        $file["path"],
        $file["date"],
        $file["description"]
      );
    }
  }

  /** @return File[] */ public function getAll() { return $this -> files; }
  public function getById(int $id): ?File {
    foreach($this -> files as $file) {
      if ($file -> getId() === $id) return $file;
    }
    return null;
  }
  public function getByPath(string $path) {
    foreach ($this->files as $file) {
      $path_test = preg_replace("/.*\/data(.*)$/", "$1", $file -> getPath());
      if (strcmp($path_test, $path) === 0) return $file;
    }
    return null;
  }

  public function getFile(int $id) {
    $file = $this -> getById($id);
    if (is_null($file)) { throw new Exception("Fichier introuvable", 404); }

    header("Content-type: {$file -> getType()}", true, 200);
    header("Content-Description: File Transfer");
    header("Content-Disposition: attachment; filename= {$file -> getFilename()}");
    header("Content-Transfer-Encoding: binary");

    $path = preg_replace("/.*\/data(.*)$/", "$1", $file -> getPath());

    readfile($this -> FILES_DIRECTORY . $path);
  }

  public function add($uploadedFile, string $description, ?int $id = null) {
    if (is_null($id)) return false;

    $ID = str_pad((string) $id, 8, "0", STR_PAD_LEFT);

    $path = "/" . ($ID ?? "") . "/";
    if (!file_exists($this -> FILES_DIRECTORY . $path)) { mkdir($this -> FILES_DIRECTORY . $path, 0777, true); }

    $path .= $uploadedFile["name"];
    $file = $this -> getByPath($path);

    $path_complete = $this -> FILES_DIRECTORY . $path;

    if (is_null($file)) {
      $file = File::create($id, $uploadedFile["name"], $uploadedFile["type"], $path, $description);
      if ($this -> upload($uploadedFile["tmp_name"], $path_complete)) {
        $this -> files[] = $file;
        return $this -> save() === false ?: $file;
      }
      return false;
    }
    if ($this -> upload($uploadedFile["tmp_name"], $path_complete)) {
      $file
        -> setDate((new DateTime("now", new DateTimeZone("Europe/Paris"))) -> format("Y-m-d H:i"))
        -> setDescription($description);
      
      return $this -> save() === false ?: $file;
    }
    return false;
  }

  public function delete(int $id) {
    $file = $this -> getById($id);
    if (is_null($file)) return false;

    if($this -> remove($this -> FILES_DIRECTORY . $file -> getPath())) {
      $this -> files = array_values(array_filter($this -> files, function($f) use($file) {
        return $f -> getId() !== $file -> getId();
      }));

      return $this -> save() === false ?: $file;
    }

    return false;
  }

  public function deleteAll(?int $project_id = null) {
    if(is_null($project_id)) return false;

    $ID = str_pad((string) $project_id, 8, "0", STR_PAD_LEFT);
    $path = preg_replace("/\/\/\/?/", "/", $this->FILES_DIRECTORY . "/" . ($ID ?? "") . "/");

    if ($this -> removeDir($path)) {
      $this -> files = array_values(array_filter($this -> files, function($f) use($project_id) {
        return $f -> getProjectId() !== $project_id;
      }));

      return $this -> save() === false ?: true;
    }

    return false;
  }

  public function getJson(): string {
    foreach($this -> files as $file) {
      $file -> setPath("*");
    }
    return json_encode($this -> files);
  }
}