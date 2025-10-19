import apiClient from "./apiClient";

const handleApiResponse = (response) => ({
    success: true,
    data: response.data.data,
    message: response.data.message,
});
const handleError = (error) => ({
    success: false,
    message: error.response?.data?.message || "Lỗi kết nối server",
});
class SettingService {
    // Lấy danh sách phòng chiếu phân trang
    async getAllSetting() {
        try {
            const response = await apiClient.get("/setting");
            return handleApiResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }

    async creatSetting(settingData) {
        try {
            const response = await apiClient.post("/setting", settingData);
            return handleApiResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }

    async updateSetting(settingData) {
        try {
            const response = await apiClient.put("/setting", settingData);
            return handleApiResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }

    // Xóa phòng chiếu
    async deleteSetting(settingId) {
        try {
            const response = await apiClient.delete(`/setting/${settingId}`);
            return handleApiResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }
}

export default new SettingService();
