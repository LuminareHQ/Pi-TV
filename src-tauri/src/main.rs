// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::sync::OnceLock;

use actix_web::web;
use actix_web::{App, HttpResponse, HttpServer, Responder};
use local_ip_address::local_ip;
use serde::Deserialize;
use tauri::{Manager, Window};

static WINDOW: OnceLock<Window> = OnceLock::new();

#[derive(Deserialize, Debug)]
struct AppSession {
    event: String,
    action: String,
    modifier: Option<String>,
}

#[derive(Clone, serde::Serialize)]
struct RemotePayload {
    event: String,
    action: String,
    modifier: Option<String>,
}

fn main() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_websocket::init())
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            let current_ip = local_ip().unwrap();

            _ = WINDOW.set(window);

            async fn hello() -> impl Responder {
                HttpResponse::Ok().body(fs::read_to_string("remote.html").unwrap())
            }

            async fn handle_actions(query: web::Query<AppSession>) -> impl Responder {
                // println!("{:?}", query);
                let event = &query.event;
                let action = &query.action;
                let modifier = &query.modifier;
                WINDOW
                    .get()
                    .expect("Window is available")
                    .emit(
                        "action",
                        RemotePayload {
                            event: event.as_str().into(),
                            action: action.as_str().into(),
                            modifier: modifier.clone().into(),
                        },
                    )
                    .unwrap();
                HttpResponse::Ok().body("Action Sent To TV")
            }

            tauri::async_runtime::spawn(
                HttpServer::new(move || {
                    App::new()
                        .route("/", web::get().to(hello))
                        .route("/actions", web::post().to(handle_actions))
                })
                .bind((current_ip, 80))
                .expect("Failed to bind remote address")
                .run(),
            );

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_network_ip])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    app.run(|_, _| {})
}


#[tauri::command]
fn get_network_ip() -> String {
    local_ip().unwrap().to_string()
}