<?php

abstract class USERS
{
  private const SUPERADMIN = "c436440b-976b-4706-b6f6-c4ec14576352";
  private const DEVELOPPEMENT_ADMIN = "o9autqee-8xu6-s7e2-qw3k-lyrh8hvxa7ga";
  private const BI_ADMIN = "9gw39v04-wjp5-zsfi-4hze-xud3pe3811x7";
  private const EDITIQUE_ADMIN = "wl9fgabe-htb3-vlwf-wzi2-bx5xcut0kzmg";
  private const INFRA_ADMIN = "dami0t2y-x0ii-zk6v-3jmc-lkcsrl7mgnu0";
  private const CAFETERIA_ADMIN = "uc0q6mjk-nn75-7g0i-9vq5-ywn9or8srs35";
  private const ESPACE_PARTENAIRE_ADMIN = "d50cdfb3-bcd0-5c08-b689-fff9bx5xs7e2";
  private const DSN_ADMIN = "lkcsrl7m-x0ii-9vq5-4hze-fffo9autqee2";
  private const GESTION = "fff9cff0-c2f3-4918-ae82-d50cdfb30419";
  private const BACKOFFICE = "ba45b887-3bf6-4fca-bcd0-39f5f905a49a";
  private const DIRECTION = "01b9cb66-d071-42b7-83d8-bba4a8eff5cc";
  private const DSI = "bcd04fca-ba45-44e8-78f8-b887c4ecb5c1";
  private const COTISATION = "ba929f52-5c08-4b0f-945a-4aab64814cee";
  private const COMMISSIONS = "56a6c238-a27d-411a-9a70-f23048f4179a";
  private const COMPTABILITE = "7ed9cac5-3154-4112-97a6-c9dabec9a59e";
  private const COMPLIANCE = "a7b3c89a-8a73-4cc4-8b14-bab942acf4ff";
  private const MARKETING = "3c36fdaa-169d-45ae-8cc8-1d546521b919";
  private const RH = "29eb3718-ac1f-47d8-b689-0249bca8aec7";
  private const PREVOYANCE = "bc42f530-b5c1-4616-89d6-b3349662d092";
  private const IARD = "6e709cbd-9073-4597-8973-d515d3528c9c";

  private static function getConstants(): array
  {
    $CURRENT_CLASS = new ReflectionClass(__CLASS__);
    return $CURRENT_CLASS->getConstants();
  }

  public static function tokenExist(?string $token = ""): bool
  {
    $CONSTANTS = array_flip(self::getConstants());
    return array_key_exists($token, $CONSTANTS);
  }

  public static function getUser(?string $token = null)
  {
    if (is_null($token)) {
      return null;
    }

    $CONSTANTS = array_flip(self::getConstants());
    if (self::tokenExist($token)) {
      return $CONSTANTS[$token];
    }

    return null;
  }

  public static function getUsers($all = false)
  {
    $CONSTANTS = array_flip(self::getConstants());
    $users = [];

    if ($all) {
      foreach (array_values($CONSTANTS) as $constant) {
        $users[$constant] = $constant;
      }
    } else {
      foreach (array_values(array_diff(array_values($CONSTANTS), ['SUPERADMIN'], ['ADMIN'])) as $constant) {
        $users[$constant] = $constant;
      }
    }

    return $users;
  }

  public static function isAdmin(?string $token = ""): bool
  {
    if (!self::tokenExist($token)) return false;
    if (self::isSuperAdmin($token)) return true;

    $CONSTANTS = array_flip(self::getConstants());
    return strpos($CONSTANTS[$token], "_ADMIN") !== false;
  }

  public static function isSuperAdmin(?string $token = ""): bool
  {
    if (!self::tokenExist($token)) return false;

    $CONSTANTS = array_flip(self::getConstants());
    return $CONSTANTS[$token] === "SUPERADMIN";
  }
}
