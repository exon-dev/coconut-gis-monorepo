<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Programs;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    //
    public function index()
    {
        $programs = Programs::select('*')
            ->with('admin')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($programs);
    }

    public function get_programs_created_by_admin(Request $request)
    {
        try {
            $program = Programs::select('*')
                ->where('admin_id', $request->admin_id)
                ->get();

            if (!$program) {
                return response()->json(
                    ['message' => 'No programs found'],
                    404
                );
            }

            return response()->json($program);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function create_program(Request $request)
    {
        try {
            $program = new Programs();
            $program->cover_image = $request->cover_image;
            $program->program_name = $request->program_name;
            $program->program_description = $request->program_description;
            $program->program_objectives = json_encode(
                $request->program_objectives
            );
            $program->program_timeline = json_encode(
                $request->program_timeline
            );
            $program->program_eligibility = $request->program_eligibility;
            $program->admin_id = $request->admin_id;
            $program->save();

            return response()->json($program);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
