<?php

abstract class STATUS {
  const WAITING = "EN ATTENTE";
  const PROGRESS = "EN COURS";
  const RECIPE = "RECETTE";
  const PRODUCTION = "PRODUCTION";
  const CANCELLED = "ANNULE";

  public static function json(): array {
    return [
      "WAITING" => self::WAITING,
      "PROGRESS" => self::PROGRESS,
      "RECIPE" => self::RECIPE,
      "PRODUCTION" => self::PRODUCTION,
      "CANCELLED" => self::CANCELLED
    ];
  }
}