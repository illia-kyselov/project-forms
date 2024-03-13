import NotificationService from "../services/NotificationService";

const addCatalogElement = async (data) => {
  try {
    const addResponse = await fetch(
      `http://localhost:3001/catalog/elements/${data.uuid}`,
      {
        method: "POST",
        data: data,
      }
    );

    if (!addResponse.ok) {
      NotificationService.showErrorNotification("Error adding element record");
      return;
    }

    const result = await addResponse.json();
    NotificationService.showSuccessNotification("Record added successfully", result);
  } catch (error) {
    console.error("Error add record:", error);
  }
};

export { addCatalogElement };
