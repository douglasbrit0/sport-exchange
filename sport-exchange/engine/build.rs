// engine/build.rs
use std::{env, path::PathBuf};

fn main() {
    let proto_root = PathBuf::from(env::var("PROTO_ROOT").unwrap_or_else(|_| "contracts/proto".into()));
    let api_dir = proto_root.join("engine").join("v1");

    let protos: Vec<_> = walkdir::WalkDir::new(&api_dir)
        .into_iter()
        .filter_map(Result::ok)
        .filter(|e| e.path().extension().and_then(|s| s.to_str()) == Some("proto"))
        .map(|e| e.into_path())
        .collect();

    assert!(!protos.is_empty(), "No .proto files in {}", api_dir.display());

    // Debian’s well-known protos live here
    let wkt_include = PathBuf::from(env::var("PROTOC_INCLUDE").unwrap_or_else(|_| "/usr/include".into()));

    tonic_build::configure()
        .build_client(false)
        .build_server(true)
        .compile(&protos, &[proto_root.clone(), wkt_include])
        .expect("Failed to compile protos");

    println!("cargo:rerun-if-changed={}", api_dir.display());
}
