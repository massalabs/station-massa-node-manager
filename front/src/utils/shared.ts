export const downloadFile = async (data: string, nameFile: string , errorDescription: string) => {
    try {
        const blob = new Blob([data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nameFile);
        document.body.appendChild(link);
        link.click();
        return blob;
        
    } catch (error) {
        console.error(errorDescription,error);
    }
};
