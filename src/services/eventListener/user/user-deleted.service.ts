import UsersModel from "../../../models/users.model";
import EventListenerAbstract from "../event-listener.abstract";
import EventListenerService from "../event-listener.interface";
import UsersService from "../../users.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";

export default class UserDeletedEventListenerService extends EventListenerAbstract<UsersModel> implements EventListenerService<UsersModel> {
  private usersService: UsersService;

  constructor() {
    super();
    this.usersService = new UsersService();
  };

  execute = async (): Promise<void> => {
    if (!this.state) {
      console.error("State cannot be empty!");
      return;
    };

    const userId = this.state.new_details.id!;
    const existingUser = await this.usersService.getById(userId)
      .catch(err => {
        if (err instanceof NotFoundException) {
          console.log(`User ${userId} not exist!`);
          return;
        }

        throw err;
      });

    if (!existingUser) {
      return;
    }

    const user = new UsersModel({
      ...existingUser,
      ...this.state.new_details
    });
    await this.usersService.save(user)
      .catch(err => {
        console.log("Error on deleting users", err);
      });

    console.info(`Event Notification: Successfully deleted user ${user.id}.`);
  };
};