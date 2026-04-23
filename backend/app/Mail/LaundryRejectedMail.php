<?php

namespace App\Mail;

use App\Models\Laundry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class LaundryRejectedMail extends Mailable
{
    use Queueable, SerializesModels;

    public Laundry $laundry;

    public function __construct(Laundry $laundry)
    {
        $this->laundry = $laundry;
    }

    public function build()
    {
        return $this->subject('Mesbanati — Your laundry listing needs review')
                    ->view('emails.laundry-rejected');
    }
}
