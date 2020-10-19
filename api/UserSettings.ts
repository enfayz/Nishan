import Getters from "./Getters";

import { IUserSettingsSettings, IUserSettings, NishanArg } from "../types";
import { userSettingsUpdate } from "../utils/chunk";

class UserSettings extends Getters {
  user_settings: IUserSettings;

  constructor(arg: NishanArg & { user_settings: IUserSettings }) {
    super(arg);
    this.user_settings = arg.user_settings;
  }

  async update(opt: Partial<Pick<IUserSettingsSettings, "start_day_of_week" | "time_zone" | "locale" | "preferred_locale" | "preferred_locale_origin">>) {
    const { start_day_of_week = this.user_settings.settings.start_day_of_week, time_zone = this.user_settings.settings.time_zone, locale = this.user_settings.settings.locale, preferred_locale = this.user_settings.settings.preferred_locale, preferred_locale_origin = this.user_settings.settings.preferred_locale_origin } = opt;
    await this.saveTransactions([
      userSettingsUpdate(this.user_settings.id, ['settings'], {
        start_day_of_week,
        time_zone,
        locale,
        preferred_locale,
        preferred_locale_origin
      })
    ]);
  }
}

export default UserSettings;