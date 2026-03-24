export function mapAuthError(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = String((err as { code: string }).code);
    switch (code) {
      case "auth/invalid-email":
        return "Некорректный email.";
      case "auth/user-disabled":
        return "Учётная запись отключена.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Неверный email или пароль.";
      case "auth/too-many-requests":
        return "Слишком много попыток. Попробуйте позже.";
      case "auth/network-request-failed":
        return "Нет соединения с сетью.";
      default:
        break;
    }
  }
  return "Не удалось войти. Проверьте данные и попробуйте снова.";
}
