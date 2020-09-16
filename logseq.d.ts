declare type notificationContentType = string | {
    string: string,
    type: "hiccup"
}

declare type notificationStatusType = "success" | "error"

declare namespace logseq {

    /* Events */
    declare namespace events {
        declare namespace ui {

        }
    }

    /* Actions */
    declare namespace actions {
        declare namespace ui {
            async function showNotification(c: notificationContentType, s: notificationStatusType): any
            async function overwriteBlockContent(id: string, content: string): any
        }
    }

}